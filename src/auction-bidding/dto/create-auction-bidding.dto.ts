import { Transform } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuctionBiddingDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  startingPrice: number;

  @Transform(({ value }) => new Date(value))  
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value)) 
  endDate: Date;

  @IsOptional()
  @IsNumber()
  latestBidAmount?: number;

  @IsOptional()
  @IsMongoId() 
  latestBidder?: string;
}
