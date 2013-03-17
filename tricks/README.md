Tricks
======

* record_type_id.cls

  There is a way to find record type id without using normal SOQL queries. However the benchmarking shows using SOQL query is faster. So let's just call the non-SOQL way a 'Fancy' approach.

### The idea

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

