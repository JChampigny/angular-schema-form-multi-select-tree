# Angular Schema Form Multi Select Tree

This is an add-on for [Angular Schema Form](https://github.com/json-schema-form/angular-schema-form).

[![Build Status](https://travis-ci.org/JChampigny/angular-schema-form-multi-select-tree.svg?branch=master)](https://travis-ci.org/JChampigny/angular-schema-form-multi-select-tree)

This is an adaptation of the [angular-multi-select-tree](https://github.com/a5hik/angular-multi-select-tree).

## Installation
The multi select tree is an add-on to the Bootstrap decorator. To use it, just include angular-schema-form-multi-select-tree.min.js after bootstrap-decorator.min.js.

You'll need to load the bootstrap CSS file to use multi select tree
* [Bootstrap](http://getbootstrap.com) CSS

You can also install the module with bower
`$ bower install angular-schema-form-multi-select-tree`

## Usage
The multi select tree add-on adds a new form type, treeselect.

Form Type | Becomes
--- | ---
treeselect | a multi select tree widget

Schema | Default Form type
--- | ---
"type": "array" | Multi Select Tree

### Options
#### Multiselect
```
options: {
    ...,
    multiple: true,
}
```

#### Select All
```
options: {
    ...,
    selectAll: true,
    selectAllName: "All Advertiser"
}
```

#### Async Callback
Sometimes, we want to be able to fetch data asynchronously and introduce fields inter-dependencies.

##### Callback
You can register a callback through the "options.asyncCallback" attribute. The callback must be declared in the $scope defining the form.

```
$scope.getHierarchicalData = function () {
    // Definition
};

$scope.form = [
    {
        key: "Advertisers",
        type: "treeselect",
        ...
        options: {
            asyncCallback: "getHierarchicalData",
            ...
        }
    }
];
```

##### Dependencies
Multi Select Tree uses a system of events to introduce inter-field dependencies.

###### Register events
```
options: {
    ...,
    registerEvents: [
        "Advertisers"
    ],
}
```

###### Listen events
```
options: {
    ...,
    listenEvents: [
        {
            name: "3268",
            argName: "DataAccess"
        }
    ]
}
```

## Example
### Schema
```
{
  type: "object",
  properties: {
    isActive: {
      "title": "Advertisers",
      "type": "array"
    }
  }
}
```
### Form
```
{
    key: "Advertisers",
    type: "treeselect",
    selectOnlyLeafs: "true",
    maxItems: 100,
    titleMap: null,
    options: {
        asyncCallback: "getHierarchicalData",
        registerEvents: [
            "3269"
        ],
        listenEvents: [
            {
                name: "3268",
                argName: "DataAccess"
            }
        ],
        map: {
            valueProperty: "id",
            nameProperty: [
                "name"
            ],
            separatorValue: null
        },
        multiple: true,
        selectAll: true,
        selectAllName: "All Advertiser"
    },
    tooltip: {
        content: "Select your advertiser(s)",
        position: "right"
    }
}
```
