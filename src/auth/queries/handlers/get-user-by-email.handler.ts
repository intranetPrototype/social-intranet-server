import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "../impl";
import { AuthRepository } from "src/auth/db";
import { User } from "src/auth/model";

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {

  constructor(private readonly authRepository: AuthRepository) { }

  execute({ email }: GetUserByEmailQuery): Promise<User> {
    return this.authRepository.findUserByEmail(email);
  }

}