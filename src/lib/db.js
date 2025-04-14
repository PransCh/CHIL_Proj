import sql from 'mssql';

const config = {
  server: 'AMGDCSQLT1\\W22T1',
  port: 14133,
  database: 'Interns_2025',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'sw',
      userName: 'ADMDSCCP2',
      password: 'UIj]tUN~drd.KWq'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
}

let pool;

export const getConnection = async () => {
  if (!pool) {
    pool = sql.connect(config);
    console.log("DB Connected")
  }
  return pool;
};