import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPersonService } from './delivery-person.service';

describe('DeliveryPersonService', () => {
  let service: DeliveryPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryPersonService],
    }).compile();

    service = module.get<DeliveryPersonService>(DeliveryPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
