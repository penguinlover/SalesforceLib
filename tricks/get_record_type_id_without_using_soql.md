## Get RecordType Id without using SOQL query

----------------------

There is a way to find record type id without using normal SOQL queries. However the benchmarking shows using SOQL query is faster. So let's just call the non-SOQL way a 'Fancy' approach.

**The idea**

The key is to get a Schema.DescribeSobjectResult back from whatever sObject you want to describe and inspects the record types of it.

There are three ways to do this

```Java
// use static method
Schema.DescribeSObjectResult meta1 = Schema.SObjectType.Account;

// use getDescribe method on the sObject token
Schema.DescribeSObjectResult meta2 = Account.getSObjectType().getDescribe();

// if you want this to be dynamic
// do a globalDescribe
Schema.SObjectType objType = Schema.getGlobalDescribe().get('Account');
Schema.DescribeSObjectResult meta3 = objType.getDescirbe();

// Now with either of the above
Map<String, Schema.RecordTypeInfo> rtMapByName =
  <meta1, meta2, meta3>.getRecordTypeInfosByName();
rtMapByName.get('YourRecordTypeName').getId();
```

In this trick, we use the last approach, since it is more generic.

## Sample code

```java
public class RecordTypeIdTrick{

  public static ID getRecordTypeIdNormal(String objType, String name){
    List<RecordType> types = [SELECT Id
                              FROM RecordType
                              WHERE SObjectType = :objType
                              AND Name =:name LIMIT 1];
    return types[0].Id;
  }

  public static ID getRecordTypeIdFancy(String objType, String name){
    SObject obj;
    Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objType);
    if (targetType != null){
      obj = targetType.newSObject();
      Schema.DescribeSObjectResult d = obj.getSObjectType().getDescribe();
      if (d != null){
        Map<String, Schema.RecordTypeInfo> rtMap = d.getRecordTypeInfosByName();
        if (rtMap != null){
          Schema.RecordTypeInfo rtInfo = rtMap.get(name);
          if (rtInfo != null){
            return rtInfo.getRecordTypeId();
          }
        }
      }
    }
    return null;
  }

  private static testMethod void benchmarking(){
    List<RecordType> types = [SELECT Id, Name, SObjectType
                              FROM RecordType LIMIT 1];
    if (types.size() == 1){
      String sobjecType = types[0].SObjectType;
      String name       = types[0].Name;

      Long start1, end1, start2, end2;
      start1 = system.currentTimeMillis();
      Id fancyId = getRecordTypeIdFancy(sobjectType, name);
      end1 = system.currentTimeMillis();

      start2 = system.currentTimeMillis();
      Id normalId = getRecordTypeIdNormal(sobjectType, name);
      end2 = system.currentTimeMillis();

      system.debug('Get RecordType id ' +  fancyId + ' fancy way:' +
                    ' used [' + (end1-start1) + '] milliseconds.' +
                   'Get RecordType id ' + normalId + ' normal way:' +
                    ' used [' + (end2-start2) +'] milliseconds.');
    }
  }
}
```
