public class OrComposite extends Composite{
  public override Boolean evalute(){
    for(Expression expr : children){
      if(expr.evaluate()){
        return true;
      }
    }
    return false;
  }
}
