import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AuctionBiddingService } from './auction-bidding.service';
import { CreateAuctionBiddingDto } from './dto/create-auction-bidding.dto';
import { UpdateAuctionBiddingDto } from './dto/update-auction-bidding.dto';

@Controller('auction-bidding')
export class AuctionBiddingController {
  constructor(private readonly auctionBiddingService: AuctionBiddingService) {}

  @Post('create')
  create(@Body() createAuctionBiddingDto: CreateAuctionBiddingDto) {
    return this.auctionBiddingService.create(createAuctionBiddingDto);
  }

  @Get()
  findAll() {
    return this.auctionBiddingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionBiddingService.findOne(id);
  }

  @Post(':id/place-bid')
  placeBid(
    @Param('id') id: string, 
    @Body() updateAuctionBiddingDto: UpdateAuctionBiddingDto, 
    @Request() request: any, 
  ) {
    return this.auctionBiddingService.placeBid(
      id,
      updateAuctionBiddingDto,
      request,
    );
  }

  @Patch(':id/end-auction')
  endAuction(@Param('id') id: string) {
    return this.auctionBiddingService.endAuction(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionBiddingService.remove(id);
  }
}
