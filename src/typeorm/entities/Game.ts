import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publisher } from './Publisher';

@Index('fk_games_publisher_idx', ['publisher'], {})
@Entity('games', { schema: 'tecbeats' })
export class Game {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 45 })
  title: string;

  @Column('decimal', { name: 'price', precision: 10, scale: 0 })
  price: number;

  @Column('int', { name: 'publisher' })
  publisher: number;

  @Column('varchar', { name: 'tags', nullable: true, length: 250 })
  tags: string | null;

  @Column('datetime', { name: 'release_date', nullable: true })
  releaseDate: Date | null;

  @ManyToOne(() => Publisher, (publishers) => publishers.games, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'publisher', referencedColumnName: 'id' }])
  publisherEntity: Publisher;
}
