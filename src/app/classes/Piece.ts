export default class Piece{
    name: string;
  rules: any;
      
    constructor(rules:any,name:string){
      this.rules = rules;
      this.name = name;
    }
    getRules() {
      return this.rules
    }
  }
  