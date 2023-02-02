import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserQuery } from "../impl";
import { AuthRepository } from "src/auth/db";
import { User } from "src/auth/model";

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {

  constructor(private readonly authRepository: AuthRepository) { }

  execute({ id }: GetUserQuery): Promise<User> {
    return this.authRepository.findUserById(id);
  }

}