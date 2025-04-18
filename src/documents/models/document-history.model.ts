import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Document } from './document.model';
import { User } from '../../users/user.model';

@Table({ tableName: 'document_histories', timestamps: true })
export class DocumentHistory extends Model<DocumentHistory> {
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
  declare editedBy: string;

  @BelongsTo(() => User)
  declare editor: User;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare oldContent: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare editedAt: Date;
}
