import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CardsService } from './cards.service';

@Injectable()
export class CanEditCardGuard implements CanActivate {
  constructor(private cardService: CardsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToHttp().getRequest();
    const cardId = data.params.cardId ?? data.body.cardId;
    const userId = data.params.userId ?? data.body.userId;

    return this.cardService.findCardWithUser(cardId).then((card) => {
      if (card) {
        if (card.user && parseFloat(userId) === card.user.id) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new HttpException('Card not found', HttpStatus.BAD_REQUEST);
      }
    });
  }
}
