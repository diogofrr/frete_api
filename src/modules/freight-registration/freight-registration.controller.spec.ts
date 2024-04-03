import { Test, TestingModule } from '@nestjs/testing';
import { FreightRegistrationController } from './freight-registration.controller';
import { FreightRegistrationService } from './freight-registration.service';

describe('FreightRegistrationController', () => {
  let controller: FreightRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreightRegistrationController],
      providers: [FreightRegistrationService],
    }).compile();

    controller = module.get<FreightRegistrationController>(
      FreightRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
