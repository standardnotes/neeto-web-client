import { Result, SyncUseCaseInterface } from '@standardnotes/domain-core'
import { Environment } from '@standardnotes/models'

export class IsWebApp implements SyncUseCaseInterface<boolean> {
  constructor(private environment: Environment) {}

  execute(): Result<boolean> {
    return Result.ok(this.environment === Environment.Web)
  }
}
