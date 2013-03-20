What is this
============

This code solves the problem of retrieving very large volumn of data from Salesforce in a relatively small amount of time.

"large volumn" means > 100,000,000 records

"small amount of time" means < 3 hours - if you use `connection.query`
"small amount of time" means < 30 mins - if you use `connection.queryAll`

*queryAll* is faster since it does not filter on `isDeleted = true`

How to use it
=============

## How to generate the enterpise.jar

First you need to download your enterprise wsdl from the target Salesfoce instance.

Then run the following cmd

```
$ java -cp jars/force-wsc-27.0.0-jar-with-dependencies.jar com.sforce.ws.tools.wsdlc wsdls/enterprise.wsdl.xml jars/enterprise.jar
```

## config

! It is highly recommended that you read all the possible configuration options

```
$ vi config.yml
```

## compile

```
$ script/build
```

or

```
$ javac -cp "jars/*" BulkClientDriverUnitTest.java BulkClientDriver.java DriverRunner.java DriverMonitor.java
```

## run

```
$ script/run
```

or

```
$ java -cp ".:jars/*" DriverRunner
```

## run unit test

```
$ script/runtest
```

or

```
$ java -cp ".:jars/*" BulkClientDriverUnitTest
```

