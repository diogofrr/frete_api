import { Test, TestingModule } from '@nestjs/testing';
import { VehicleRegistrationController } from './vehicle-registration.controller';
import { VehicleRegistrationService } from './vehicle-registration.service';

describe('VehicleRegistrationController', () => {
  let controller: VehicleRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleRegistrationController],
      providers: [VehicleRegistrationService],
    }).compile();

    controller = module.get<VehicleRegistrationController>(
      VehicleRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
