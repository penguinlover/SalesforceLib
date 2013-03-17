public class AndComposite extends Composite{
  public override Boolean evalute(){
    for(Expression expr : children){
      if(!expr.evaluate()){
        return false;
      }
    }
    return true;
  }
}
