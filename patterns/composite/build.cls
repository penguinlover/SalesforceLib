Expression expr1 = new OrComposite();
expr1.add(new Variable('1'));
Expression expr2 = new AndComposite();
exr1.add(expr2);
expr2.add(new VariableExpression('2'));
expr2.add(new VariableExpression('3'));

expr1.set('1', false)
  .set('2', true)
    .set('3', false);

system.debug( expr1.evaluate() );
