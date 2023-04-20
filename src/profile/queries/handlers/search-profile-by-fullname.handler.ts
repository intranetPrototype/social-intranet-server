import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProfileRepository } from "src/profile/db";
import { Profile } from "src/profile/model";
import { SearchProfileByFullNameQuery } from "../impl";

@QueryHandler(SearchProfileByFullNameQuery)
export class SearchProfileByFullNameHandler implements IQueryHandler<SearchProfileByFullNameQuery> {

  constructor(
    readonly profileRepository: ProfileRepository
  ) { }

  execute({ fullName }: SearchProfileByFullNameQuery): Promise<Profile[]> {
    if (!fullName) {
      return new Promise(resolve => resolve([]));
    }

    return this.profileRepository.searchProfileByFullName(fullName);
  }
}