import { Role } from 'src/modules/roles/enum/role.enum';

export class JwtDto {
  sub: number;
  email: string;
  profile_type: Role;
}
