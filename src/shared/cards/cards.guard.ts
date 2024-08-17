import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CardsService } from './cards.service';

@Injectable()
export class CanEditCardGuard implements CanActivate {
  constructor(private cardService: CardsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const cardId = context.switchToHttp().getRequest().params.cardId;
    const userId = +context.switchToHttp().getRequest().params.userId;

    return this.cardService.findCardById(cardId).then((card) => {
      if (card && card.user && userId === card.user.id) {
        return true;
      } else {
        return false;
      }
    });
  }
}
