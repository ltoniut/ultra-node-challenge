import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './Game';

@Entity('publishers', { schema: 'tecbeats' })
export class Publisher {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 45, unique: true })
  name: string;

  @Column('int', { name: 'siret' })
  siret: number;

  @Column('varchar', { name: 'phone', length: 45 })
  phone: string;

  @OneToMany(() => Game, (games) => games.publisherEntity)
  games: Game[];
}
