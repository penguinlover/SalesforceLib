## Neat way of overriding standard Salesforce Edit/Del/View/New link with Visualforce page and redirect to other Visualforce page (custom/standard).

------------------------------------------------------------------

**How it works**

A good place to place redirection logic is in the `action` method in the `apex:page` tag, this is also recommended by visualforce guide.

e.g. `action="{!doRedirection}"`

if `doRedirection` retures null, the page refreshes  
if `doRedirection` returns a pageReference, the page redirects to the new place  

The idea here is to use Salesforce formula functions to help us write less code but do more

```
action="{!NULLVALUE(Redir.url, URLFOR($Action.Contact.Edit, contact.id, null, true)}"
```

`NULLVALUE` will always first evaluate `Redir.url`, if it is null then the second parameter  
`URLFOR` is used here to generate standard "CRUD" action urls, which is awesome

This is neat isn't it.

**Sample Code**

SampleVF.page

```html
<apex:page standardController="Contact" extensions="RedirectContactEditCtrl" action="{!NULLVALUE(Redir.url, urlFor($Action.Contact.Edit, contact.id, null, true))}">
</apex:page>
```

RedirectContactEditCtrl.cls

```java
public class RedirectContactEditCtrl {
  private final ApexPages.StandardController controller;

  public RedirectContactEditCtrl(ApexPages.StandardController controller) {
    this.controller = controller;
  }

  public PageReference getRedir() {
    Contact c = [Select id, recordtypeid From Contact Where Id = :ApexPages.currentPage().getParameters().get('id')];

    PageReference pageRef;

    if (c.recordtypeid == <some id>) {
      pageRef = Page.Contact_View_1;
    } else {
      pageRef = new PageReference('/' + c.id);
      pageRef.getParameters().put('nooverride', '1');
    }

    pageRef.getParameters().put('id', c.id);
    return pageRef.setRedirect(true);
  }
}
```
