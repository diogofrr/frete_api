import { Test, TestingModule } from '@nestjs/testing';
import { VehicleRegistrationService } from './vehicle-registration.service';

describe('VehicleRegistrationService', () => {
  let service: VehicleRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleRegistrationService],
    }).compile();

    service = module.get<VehicleRegistrationService>(
      VehicleRegistrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
