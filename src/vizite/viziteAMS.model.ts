import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'viziteAMS', timestamps: false })
export class ViziteAmsModel extends Model<ViziteAmsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.DATE, field: 'dataActiune' })
  dataActiune: Date;

  @Column({ type: DataType.STRING, allowNull: false, field: 'subdiv' })
  subdiv: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'specialitate' })
  specialitate: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'numeMedic' })
  numeMedic?: string;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'nrRow' })
  nrRow: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'dataAdresarii' })
  dataAdresarii: string;

  @Column({ type: DataType.STRING(13), allowNull: false, field: 'idnpPacient' })
  idnpPacient: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'numePrenumePacient' })
  numePrenumePacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'dataNasterePacient' })
  dataNasterePacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'sexPacient' })
  sexPacient?: string;

  @Column({ type: DataType.STRING(50), allowNull: true, field: 'statutPacient' })
  statutPacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'adresaPacient' })
  adresaPacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'diagnosticPacient' })
  diagnosticPacient?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'tipVizita' })
  tipVizita?: string;
}
