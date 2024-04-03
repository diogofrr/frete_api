import { Test, TestingModule } from '@nestjs/testing';
import { FreightRegistrationService } from './freight-registration.service';

describe('FreightRegistrationService', () => {
  let service: FreightRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreightRegistrationService],
    }).compile();

    service = module.get<FreightRegistrationService>(
      FreightRegistrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
