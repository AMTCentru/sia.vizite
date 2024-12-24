import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'ticheteStatistice', timestamps: false })
export class TicheteStatModel extends Model<TicheteStatModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.DATE, field: 'dataActiune' })
  dataActiune: Date;

  @Column({ type: DataType.NUMBER, allowNull: false, field: 'nrRow' })
  nrRow: number;

  @Column({ type: DataType.STRING, allowNull: false, field: 'subdiv' })
  subdiv: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'codDiagnostic' })
  codDiagnostic: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'diagnostic' })
  diagnostic: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'dataAdresarii' })
  dataAdresarii: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'numePrenumePacient' })
  numePrenumePacient?: string;

  @Column({ type: DataType.STRING(13), allowNull: false, field: 'idnpPacient' })
  idnpPacient: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'sexPacient' })
  sexPacient?: string;

  @Column({ type: DataType.NUMBER, allowNull: true, field: 'virsta' })
  virsta?: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'dataNasterePacient' })
  dataNasterePacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'adresaPacient' })
  adresaPacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'medicDeFamilie' })
  medicDeFamilie?: string;

  @Column({ type: DataType.STRING(50), allowNull: true, field: 'efectuatDeMeidic' })
  efectuatDeMeidic?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'cazNou' })
  cazNou?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'dispensar' })
  dispensar?: string;
}
