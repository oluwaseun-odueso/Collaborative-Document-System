import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { DocumentHistory } from './document-history.model';
import { DocumentComment } from './document-comment.model';

@Table({ tableName: 'documents', timestamps: true })
export class Document extends Model<Document> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare ownerId: string;

  @BelongsTo(() => User)
  declare owner: User;

  @HasMany(() => DocumentHistory)
  declare history: DocumentHistory[];

  @HasMany(() => DocumentComment)
  declare comments: DocumentComment[];
}
