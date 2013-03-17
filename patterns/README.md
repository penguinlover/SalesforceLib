Apex Design Patterns
====================

There are more, but here are six of them seems to be useful

*  Singleton
*  Strategy (with help of Java reflection)
*  Decorator
*  Facade
*  Composite
*  Bulk State Transition

Why we care to apply a design pattern?

You know how to write Apex code, and you put down this

AccountTrigger.trigger
```Java
trigger AccountTrigger on Account (before insert, before update){
  for(Account record: Trigger.new){
    AccountFooRecordType rt = new AccountFooRecordType();
    ...
  }
}
```

AccountFooRecordType.cls
```Java
public class AccountFooRecordType {
  public String id { get; private set; }
  public AccountFooRecordType(){
    id = Account.sObjectType.getDescribe()
          .getRecordTypeInfosByName().get('Foo').getRecordTypeId();
  }
}
```

Inserts 1 account works
Inserts 200+ account does not work and it throws the following exception

```
System.LimitException: Too many record type describes: 101
```

sadness...

Somehow you remembered a pattern called 'Singleton' that learnd from school. And it seems to be able to solve this problem!

So you modifed the code a little bit

AccountFooRecordType.cls
```Java
public class AccountFooRecordType {
  private static AccountFooRecordType instance = null;
  public String id { get; private set; }

  private AccountFooRecordType(){
    id = Account.sObjectType.getDescribe()
          .getRecordTypeInfosByName().get('Foo').getRecordTypeId();
  }

  public static AccountFooRecordType getInstance(){
    if(instance == null){
      instance = new AccountFooRecordType();
    }
    return instance;
  }
}
```

AccountTrigger.trigger
```Java
trigger AccountTrigger on Account (before insert, before update){
  for(Account record: Trigger.new){
    AccountFooRecordType rt = AccountFooRecordType.getInstance();
    ...
  }
}
```

Now everything work properly! 

You've successfully applied the singleton pattern that you thought you will never make a use of it again in the rest of your life.

## Conclusion

Design patterns are useful sometimes because they do solve practical problems.
