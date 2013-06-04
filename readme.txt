//
// Overview
//
For an overview of this project please visit http://sanddragon.bl.uk

//
// SanddragonItemViewer Installation
//

1. Ensure that SanddragonWidget website has been installed and is working.
2. This application is a Maven-based application written using Java 7 and tested with Tomcat 7. Build the war file in the usual Maven fashion - mvn package
3. Update the following values in the web.xml, modify values in [value] where necessary
	- Server - http://[SanddragonItemViewer server]/
	- ViewerServer - [SanddragonItemViewer website]/
	- ImageMetadataServer - [SanddragonImageService website]
	- ImageServer - [SanddragonImageService website]
	- WidgetServer - [SanddragonWidget website]/

	NB - it is assumed that the SanddragonItemViewer, SanddragonWidget and SanddragonImageService, all reside on the same server, 
		if this is not the case you will need to modify the init function in SanddragonItemViewerController.js.

4. Update the BASE tag in index.jsp so that the website can pick up the javascript files - 
	<base href="http://[SanddragonItemViewer server]/[SanddragonItemViewer website]/"/>

5. Update the function getItemMetadata in SanddragonItemViewer.js to return json values that will provide data to the itemViewer -
	It should follow this pattern -

        var metadata = '{"ID":"[Book ID]","ImageList":[';
		metadata += '{"PageID":"[Page 1 ID]","ImageID":"[Image 1 filename without extension]","RoleType":"Page"}';
		metadata += ',{"PageID":"[Page 2 ID]","ImageID":"[Image 1 filename without extension]","RoleType":"Title"}";
        metadata += ',{"PageID":"[Page 3 ID]","ImageID":"[Image 1 filename without extension]","RoleType":"Page"}';
		...
        metadata += ',{"PageID":"[Page 51 ID]","ImageID":"[Image 1 filename without extension]","Label":"48","RoleType":"Page"}';        
        metadata += '],"BookMetadata":{"Author":"[Author]","Title":"[Book Title]","PublicationDetails":"[Publication Details]","[Any other fields]":"[Other fields]"}}';