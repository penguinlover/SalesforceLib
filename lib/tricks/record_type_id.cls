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
