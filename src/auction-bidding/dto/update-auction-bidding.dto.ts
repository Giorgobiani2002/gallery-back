import { PartialType } from '@nestjs/mapped-types';
import { CreateAuctionBiddingDto } from './create-auction-bidding.dto';
import { IsNumber } from 'class-validator';

export class UpdateAuctionBiddingDto extends PartialType(
  CreateAuctionBiddingDto,
) {
  @IsNumber()
  amount: number; // This represents the bid amount.

  // This is the ID of the user placing the bid.
}
