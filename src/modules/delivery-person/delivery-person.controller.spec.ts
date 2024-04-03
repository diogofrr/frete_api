import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPersonController } from './delivery-person.controller';
import { DeliveryPersonService } from './delivery-person.service';

describe('DeliveryPersonController', () => {
  let controller: DeliveryPersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPersonController],
      providers: [DeliveryPersonService],
    }).compile();

    controller = module.get<DeliveryPersonController>(DeliveryPersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
