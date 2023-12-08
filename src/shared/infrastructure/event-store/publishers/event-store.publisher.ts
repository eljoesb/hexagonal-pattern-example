import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, IEvent, IEventPublisher } from '@nestjs/cqrs';
import { MongoEventStore } from '../mongo-event-store';
import { EventSerializer } from '../serializers/event.serializer';
import { VersionedAggregateRoot } from 'src/shared/domain/aggregate-root';
import { serialize } from 'v8';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IEventPublisher
{
  constructor(
    private readonly eventStore: MongoEventStore,
    private readonly eventBus: EventBus,
    private readonly eventSerializer: EventSerializer,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  publish<T extends IEvent = IEvent>(
    event: T,
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializedEvent = this.eventSerializer.serialize(event, dispatcher);
    return this.eventStore.persist(serializedEvent);
  }

  publishAll<T extends IEvent = IEvent>(
    events: T[],
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializedEvents = events
      .map((event) => this.eventSerializer.serialize(event, dispatcher))
      .map((serializedEvent, index) => ({
        ...serializedEvent,
        position: dispatcher.version.value + index + 1,
      }));
    return this.eventStore.persist(serializedEvents);
  }
}
