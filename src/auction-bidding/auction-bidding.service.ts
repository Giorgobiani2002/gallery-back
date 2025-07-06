import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateAuctionBiddingDto } from './dto/create-auction-bidding.dto';
import { UpdateAuctionBiddingDto } from './dto/update-auction-bidding.dto';
import { Auction } from './schema/auction-bidding.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { PaypalService } from 'src/paypal/paypal.service';

@Injectable()
export class AuctionBiddingService {
  constructor(
    @InjectModel('auction') private auctionModel: Model<Auction>,
    @InjectModel('product') private productModel: Model<Product>,
    @InjectModel('user') private userModel: Model<User>,
    private emailSenderService: EmailSenderService,
    private jwtService: JwtService,
    private readonly paypalService: PaypalService,
  ) {}

  async create(createAuctionDto: CreateAuctionBiddingDto) {
    const { productId, startingPrice, startDate, endDate } = createAuctionDto;

    const auction = new this.auctionModel({
      product: productId,
      startingPrice,
      startDate,
      endDate,
      latestBidAmount: 0,
      latestBidder: null,
    });

    await auction.save();
    return auction;
  }

  async findAll() {
    const auctions = await this.auctionModel.find().populate('product').exec();
    return auctions;
  }

  async findOne(id: string) {
    const auction = await this.auctionModel
      .findById(id)
      .populate('product')
      .exec();

    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }

    return auction;
  }

  async placeBid(
    auctionId: string,
    updateAuctionBiddingDto: UpdateAuctionBiddingDto,
    request: Request,
  ) {
    const auction = await this.auctionModel.findById(auctionId).exec();
    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }

    const { amount } = updateAuctionBiddingDto;

    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    console.log('TOKEN:', token);
    console.log('SECRET:', process.env.JWT_SECRET);

    // try {
    const decoded = this.jwtService.verify(token);
    const bidderId = decoded.userId;

    if (new Date() > auction.endDate) {
      throw new HttpException(
        'Auction has already ended',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (new Date() < auction.startDate) {
      throw new HttpException(
        'Auction has not started yet',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(amount);
    console.log(auction.latestBidAmount);

    if (amount <= auction.latestBidAmount) {
      throw new BadRequestException('bid must be higher  than latest bid ');
    }

    auction.latestBidAmount = amount;
    auction.latestBidder = bidderId;

    await auction.save();
    return auction;
    // } catch (error) {
    //   throw new HttpException(
    //     'Invalid or expired token',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
  }

  async endAuction(auctionId: string) {
    const auction = await this.auctionModel.findById(auctionId).exec();
    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }

    if (new Date() < auction.endDate) {
      throw new HttpException(
        'Auction has not ended yet',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (auction.latestBidder) {
      auction.winnerId = auction.latestBidder;
      await auction.save();

      await this.userModel.findByIdAndUpdate(
        auction.latestBidder,
        {
          $addToSet: { wonAuctions: auction._id },
        },
        { new: true },
      );
      return auction;
    } else {
      throw new HttpException(
        'No bids placed, auction cannot have a winner',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const auction = await this.auctionModel.findByIdAndDelete(id).exec();
    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }
    return auction;
  }
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleAuctionEndings() {
    const now = new Date();

    const expiredAuctions = await this.auctionModel.find({
      endDate: { $lte: now },
      winnerId: { $exists: false },
    });

    for (const auction of expiredAuctions) {
      if (auction.latestBidder) {
        auction.winnerId = auction.latestBidder;
        await auction.save();

        const user = await this.userModel.findById(auction.latestBidder);
        const product = await this.productModel.findById(auction.product);

        if (user?.email && product?.title) {
          const order = await this.paypalService.createOrder(
            user._id.toString(),
          );

          const approvalLink = order.links?.find(
            (link) => link.rel === 'approve',
          )?.href;

          const subject = `🎉 You won "${product.title}"! Complete your payment now`;
          const htmlContent = `
          <div style="font-family: Arial; border: 1px solid #ccc; padding: 20px;">
            <h2>Hello ${user.fullName || 'Bidder'},</h2>
            <p>Congratulations! You've won the auction for <strong>${product.title}</strong>.</p>
            <img src="${product.mainImgUrl}" alt="Auction Image" style="width: 100%; max-width: 600px; margin: 20px 0;" />
            <p>Your winning bid: <strong>$${auction.latestBidAmount}</strong></p>
            <p>Please complete your payment using the link below:</p>
            <a href="${approvalLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070ba; color: white; text-decoration: none;">Pay with PayPal</a>
            <p>Thank you for participating!</p>
          </div>
        `;

          await this.emailSenderService.sendEmailHtml(
            user.email,
            subject,
            htmlContent,
          );
        }
      } else {
      }
    }
  }
}
