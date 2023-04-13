import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProfileQuery } from "../impl";
import { Profile } from "../../model";
import { ProfileRepository } from "src/profile/db";

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {

  constructor(
    private readonly profileRepository: ProfileRepository
  ) { }

  execute({ userId }: GetProfileQuery): Promise<Profile> {
    return this.profileRepository.getProfile(userId);
  }

}