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

@Injectable()
export class AuctionBiddingService {
  constructor(
    @InjectModel('auction') private auctionModel: Model<Auction>,
    @InjectModel('product') private productModel: Model<Product>,
    private jwtService: JwtService,
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
}
