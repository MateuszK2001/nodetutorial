import {Sequelize} from 'sequelize';

const TutorialSequelize = new Sequelize('tutorial', 'root', 'Qweqwe12321', {
  dialect: 'mysql',
  host:'localhost'
});


export default TutorialSequelize;