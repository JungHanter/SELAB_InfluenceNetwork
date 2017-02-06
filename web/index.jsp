<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Influence Network Analytics</title>

  <link rel="stylesheet" type="text/css" href="lib/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="css/bootstrap-custom.css">
  <link rel="stylesheet" type="text/css" href="lib/directed-graph-creator/graph-creator-custom.css">
  <link rel="stylesheet" type="text/css" href="css/style.css">
</head>

<body>

<nav class="navbar navbar-dark menu-group">
  <div class="container-fluid top-menu main-menu">
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">File</a>
          <ul class="dropdown-menu">
            <li><a class="menuNew" href="#">New</a></li>
            <li><a class="menuLoad" href="#">Load</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuSave" href="#">Save</a></li>
            <li><a class="menuSaveAs" href="#">Save-As</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuDelete" href="#">Delete</a></li>
            <li><a class="menuPrint" href="#">Print</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Edit</a>
          <ul class="dropdown-menu">
            <li><a class="menuNewNode" href="#">New Node</a></li>
            <li><a class="menuDeleteNode" href="#">Delete Node</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuNewEdge" href="#">New Edge</a></li>
            <li><a class="menuDeleteEdge" href="#">Delete Edge</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuManageNodeType" href="#">Manage Node Type</a></li>
            <li><a class="menuManageConfidence" href="#">Manage Confidence</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Find</a>
          <ul class="dropdown-menu">
            <li><a id="menuFindPathSet" href="#">Find Path Set</a></li>
            <li><a id="menuFindMaxInfluencePath" href="#">Find Max Influence Path</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Option</a>
          <ul class="dropdown-menu">
            <li><a id="menuSetting" href="#">Setting</a></li>
            <li role="separator" class="divider"></li>
            <li><a id="menuHelp" href="#">Help</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>

  <div class="container-fluid top-menu sub-menu-container">
    <ul id="subMenuNode" class="nav navbar-nav">
      <div class="sub-menu-name">
        <span>Name : </span>
      </div>
      <div class="sub-menu-field">
        <input id="subMenuNodeName" type="text" class="form-control" placeholder="Node Name">
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-name">
        <span>Type : </span>
      </div>
      <div class="btn-group">
        <div id="subMenuNodeType" class="btn btn-default btn-selection unselected">Select Type</div>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul id="subMenuNodeTypeDropdown" class="dropdown-menu">
          <li><a href="#"><span class="nodeTypeColor type-color-bg">&nbsp;</span><span class="nodeTypeName">Type1</span></a></li>
        </ul>
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-btn">
        <button type="button" id="subMenuNodeEditBtn" class="btn btn-default">Edit</button>
      </div>
    </ul>

    <ul id="subMenuEdge" class="nav navbar-nav">
      <div class="sub-menu-name">
        <span>Path : </span>
      </div>
      <div class="btn-group">
        <div id="subMenuEdgeSource" class="btn btn-default btn-selection long-length unselected subMenuEdgeNode">Select Source Node</div>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul id="subMenuEdgeSourceDropdown" class="dropdown-menu subMenuEdgeNodeDropdown">
          <li><a href="#">Node 1</a></li>
        </ul>
      </div>
      <div class="sub-menu-name">
        <span> --> </span>
      </div>
      <div class="btn-group">
        <div id="subMenuEdgeTarget" class="btn btn-default btn-selection long-length unselected subMenuEdgeNode">Select Target Node</div>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul id="subMenuEdgeTargetDropdown" class="dropdown-menu subMenuEdgeNodeDropdown">
          <li><a href="#">Node 1</a></li>
        </ul>
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-name">
        <span>Influence : </span>
      </div>
      <div class="sub-menu-field">
        <input type="number" step=0.01 min=0 max=1 id="subMenuEdgeInfluence" class="form-control" placeholder="Influence">
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-btn">
        <button type="button" id="subMenuEdgeEditBtn" class="btn btn-default">Edit</button>
      </div>
    </ul>

    <ul id="subMenuNone" class="nav navbar-nav">
      <div class="sub-menu-divider"></div>
    </ul>
  </div>
</nav>

<%--<div class="zoom-menu">--%>
  <%--<button type="button" class="btn btn-dark zoom-menu-button">+</button>--%>
  <%--<button type="button" class="btn btn-dark zoom-menu-button">-</button>--%>
  <%--<span class="glyphicon glyphicon-search zoom-menu-icon" aria-hidden="true"></span>--%>
  <%--<input type="text" class="form-control zoom-menu-percentage" placeholder="100%">--%>
<%--</div>--%>


<div class="content">
  <nav class="side-menu">
    <button type="button" class="btn btn-dark side-menu-button menuNewNode">NN<span class="tooltip-text">New Node</span></button>
    <button type="button" class="btn btn-dark side-menu-button menuDeleteNode">DN<span class="tooltip-text">Delete Node</span></button>
    <button type="button" class="btn btn-dark side-menu-button menuNewEdge">NE<span class="tooltip-text">New Edge</span></button>
    <button type="button" class="btn btn-dark side-menu-button menuDeleteEdge">DE<span class="tooltip-text">Delete Edge</span></button>
  </nav>
  <div class="graph-area">
    <div id="graph"></div>
  </div>
</div>

<div id="newEdgeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">New Edge</h4>
      </div>
      <div class="modal-body">
        <div>
          <span>Source Node : </span><br/>
          <div class="btn-group">
            <div id="newEdgeDlgSource" class="btn btn-default btn-selection long-length unselected newEdgeDlgNode">Select Source Node</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="newEdgeDlgSourceDropdown" class="dropdown-menu newEdgeDlgNodeDropdown">
              <li><a href="#">Node 1</a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <span>Target Node : </span><br/>
          <div class="btn-group">
            <div id="newEdgeDlgTarget" class="btn btn-default btn-selection long-length unselected newEdgeDlgNode">Select Target Node</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="newEdgeDlgTargetDropdown" class="dropdown-menu newEdgeDlgNodeDropdown">
              <li><a href="#">Node 1</a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <span>Influence (0 to 1) : </span>
          <input type="number" step=0.01 min=0 max=1 id="newEdgeDlgInfluence" class="form-control" placeholder="Influence Value">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnNewEdgeModalConfirm" class="btn btn-dark">Create</button>
      </div>
    </div>
  </div>
</div>

<div id="manageNodeTypeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Manage Node Type</h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-8">
            <div class="list-header">
              <h5>Node Types</h5>
              <div class="btn-group" role="group">
                <a id="btnDeleteNodeType" class="btn btn-default btn-xs" aria-label="Delete Node Type">
                  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </a>
                <a id="btnEditNodeTypeName" class="btn btn-default btn-xs" aria-label="Edit Node Type Name">
                  <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </a>
                <a id="btnAddNodeType" class="btn btn-default btn-xs" aria-label="Add Node Type">
                  <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </a>
              </div>
            </div>
            <div id="manageNodeTypeList" class="list-group">
              <a href="#" class="list-group-item active">Type 1</a>
              <a href="#" class="list-group-item">Type 2</a>
            </div>
            <span class="unfocusor" style="display: none;">&nbsp;</span>
          </div>
          <div class="col-xs-4">
            <div>
              <h5>Select Color</h5>
            </div>
            <div id="manageNodeTypeColorList" class="list-group">
              <a href="#" class="list-group-item active" data-color="red">Red <span class="typeColor type-color-bg type-color-red">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="pink">Pink <span class="typeColor type-color-bg type-color-pink">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="purple">Purple <span class="typeColor type-color-bg type-color-purple">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="deep-purple">Deep Purple <span class="typeColor type-color-bg type-color-deep-purple">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="indigo">Indigo <span class="typeColor type-color-bg type-color-indigo">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="blue">Blue <span class="typeColor type-color-bg type-color-blue">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="light-blue">Light Blue <span class="typeColor type-color-bg type-color-light-blue">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="cyan">Cyan <span class="typeColor type-color-bg type-color-cyan">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="teal">Teal <span class="typeColor type-color-bg type-color-teal">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="green">Green <span class="typeColor type-color-bg type-color-green">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="light-green">Light Green <span class="typeColor type-color-bg type-color-light-green">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="lime">Lime <span class="typeColor type-color-bg type-color-lime">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="yellow">Yellow <span class="typeColor type-color-bg type-color-yellow">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="amber">Amber <span class="typeColor type-color-bg type-color-amber">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="orange">Orange <span class="typeColor type-color-bg type-color-orange">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="deep-orange">Deep Orange <span class="typeColor type-color-bg type-color-deep-orange">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="brown">Brown <span class="typeColor type-color-bg type-color-brown">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="grey">Grey <span class="typeColor type-color-bg type-color-grey">&nbsp;</span></a>
              <a href="#" class="list-group-item" data-color="blue-grey">Blue Grey <span class="typeColor type-color-bg type-color-blue-grey">&nbsp;</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <%--<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>--%>
        <%--<button type="button" id="btnManageNodeTypeModalConfirm" class="btn btn-dark">Confirm</button>--%>
      </div>
    </div>
  </div>
</div>

<div id="manageConfidenceModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="false">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Manage Confidence</h4>
      </div>
      <div class="modal-body">
        <div class="table-container" >
          <div id="confidenceTable" class="fixedTable">
            <header class="fixedTable-header">
              <table class="table table-bordered">
                <thead>
                <tr>
                  <th class="type-color-bg type-color-text type-color-red">A</th>
                  <th class="type-color-bg type-color-text type-color-blue">B</th>
                </tr>
                </thead>
              </table>
            </header>
            <aside class="fixedTable-sidebar">
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <th class="type-color-bg type-color-text type-color-red">A</th>
                </tr>
                <tr>
                  <th class="type-color-bg type-color-text type-color-blue">B</th>
                </tr>
                </tbody>
              </table>
            </aside>
            <div class="fixedTable-body">
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <td class="td-empty"></td>
                  <td class="td-input"><input type="number" step=0.01 min=0 max=1 /></td>
                </tr>
                <tr>
                  <td class="td-input"><input type="number" step=0.01 min=0 max=1 /></td>
                  <td class="td-empty"></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <%--<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>--%>
        <%--<button type="button" id="btnManageConfidenceModalConfirm" class="btn btn-dark">Confirm</button>--%>
      </div>
    </div>
  </div>
</div>

<div id="alertModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 id="alertModalTitle" class="modal-title">Alert</h4>
      </div>
      <div class="modal-body">
        <p id="alertModalMsg">message</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark" data-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>


<script src="lib/jquery/jquery-3.1.1.min.js"></script>
<script src="js/jquery_extends.js"></script>
<script src="lib/bootstrap/js/bootstrap.min.js"></script>
<%--<script src="lib/d3/d3.min.js"></script>--%>
<script src="lib/d3/d3.v3.min.js" charset="utf-8"></script>
<script src="lib/directed-graph-creator/graph-creator-custom.js"></script>
<script src="js/main.js"></script>


</body>
</html>