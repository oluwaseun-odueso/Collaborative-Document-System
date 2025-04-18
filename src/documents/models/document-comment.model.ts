import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Document } from './document.model';
import { User } from '../../users/user.model';

@Table({ tableName: 'document_comments', timestamps: true })
export class DocumentComment extends Model<DocumentComment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Document)
  @Column(DataType.UUID)
  declare documentId: string;

  @BelongsTo(() => Document)
  declare document: Document;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare createdAt: Date;
}
