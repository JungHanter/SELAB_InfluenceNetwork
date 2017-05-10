<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Influence Network Analyzer</title>

  <%--<link rel="stylesheet" type="text/css" href="lib/SnackBar/snackbar.css">--%>
  <link rel="stylesheet" type="text/css" href="lib/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="css/bootstrap-custom.css">
  <%--<link rel="stylesheet" type="text/css" href="lib/directed-graph-creator/graph-creator-custom.css">--%>
  <link rel="stylesheet" type="text/css" href="lib/directed-graph-creator/graph-creator-custom-v2.css">
  <link rel="stylesheet" type="text/css" href="css/cust-ui.css">
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <link rel="stylesheet" type="text/css" href="lib/Tiny-Multipurpose-Dialog-Popup-Plugin-With-jQuery-dialogbox-js/css/dialogbox.css">
</head>

<body>
<nav class="navbar navbar-dark menu-group no-print">
  <div class="container-fluid top-menu top-menu-main">
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav main-menu">
        <h5 id="top-left-title">INAS</h5>
        <li class="dropdown">
          <a  class="dropdown-toggle dropdown-default " data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">File</a>
          <ul class="dropdown-menu dropdown-menu-file">
            <li><a class="menuNew menuDefault" >New</a></li>
            <li><a class="menuOpen menuDefault" >Open</a></li>
            <li><a class="menuEditName" >Edit Name</a></li>
            <li><a class="menuDelete" >Delete</a></li>
            <li><a class="menuClose" >Close</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuSave" >Save</a></li>
            <li><a class="menuSaveAs" >Save-As</a></li>
            <li><a class="menuSaveAsImage" >Save-As-Image</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuPrint" >Print</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuAbout menuDefault" >About</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Edit</a>
          <ul class="dropdown-menu">
            <li><a class="menuNewNode" >New Node</a></li>
            <li><a class="menuDeleteNode" >Delete Node</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuNewEdge" >New Edge</a></li>
            <li><a class="menuDeleteEdge" >Delete Edge</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuManageNodeType" >Manage Node Type</a></li>
            <li><a class="menuManageEdgeType" >Manage Edge Type</a></li>
            <li><a class="menuManageConfidence" >Manage Confidence</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuUndo" >Undo</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">View</a>
          <ul class="dropdown-menu">
            <li><a >Graphical View</a></li>
            <li><a >Table View</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuManageEdgeTypeView" >Edge Type View Setting</a></li>
            <li role="separator" class="divider"></li>
            <li><a >Zoom-In</a></li>
            <li><a >Zoom-Out</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Analyze</a>
          <ul class="dropdown-menu">
            <%--<li><a class="menuSummary" >Summary</a></li>--%>
            <%--<li><a class="menuStatistics" >Statistics</a></li>--%>
            <%--<li role="separator" class="divider"></li>--%>
            <li><a class="menuMaxInfluence" >Max Influence</a></li>
            <li><a class="menuMaxInfluenceTable" >Max Influence Table</a></li>
            <li role="separator" class="divider"></li>
            <li><a class="menuMostSumInfluence" >Most Sum Influence</a></li>
            <li><a class="menuMostAverageInfluence" >Most Average Influence</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a  class="dropdown-toggle dropdown-default" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help</a>
          <ul class="dropdown-menu">
            <li><a >News</a></li>
            <li><a >Events</a></li>
            <li role="separator" class="divider"></li>
            <li><a >Sites</a></li>
            <li><a >Resources</a></li>
          </ul>
        </li>
      </ul>

      <ul class="nav navbar-nav navbar-right" id="menuUser" style="display: none">
        <li class="dropdown">
          <a  id="menuUserWelcome" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Welcome John!</a>
          <ul class="dropdown-menu">
            <li><a id="menuEditInfo" >Edit My Information</a></li>
            <li><a id="menuSignout" >Sign out</a></li>
          </ul>
        </li>
      </ul>
      <div class="nav navbar-nav navbar-right" id="menuSignin">
        <form id="signinForm" class="form-signin" name="signinForm" accept-charset="UTF-8" method="POST">
          <input type="email" id="signinEmail" name="email" maxlength="78" class="form-control"
                 placeholder="Email" required autofocus>
          <input type="password" id="signinPassword" name="pw" maxlength="20" class="form-control"
                 placeholder="Password" required>
          <div id="checkboxRemember" class="checkbox">
            <label>
              <input id="checkRemember" type="checkbox" value="remember"> Remember Me
            </label>
          </div>
          <button id="btnSignin" class="btn btn-primary btn-block" type="submit">Sign in</button>
        </form>
        <div class="signin-more">
          <a id="menuForgot">Forgot your Password?</a>
          <a id="menuSignup" class="pull-right">Create new account?</a>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid top-menu sub-menu-container">
    <ul id="subMenuNode" class="nav navbar-nav">
      <div class="sub-menu-name">
        <span>Domain ID : </span>
      </div>
      <div class="sub-menu-field">
        <input id="subMenuDomainId" type="text" class="form-control" placeholder="Domain ID">
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-name">
        <span>Name : </span>
      </div>
      <div class="sub-menu-field">
        <input id="subMenuNodeName" type="text" class="form-control" placeholder="New Node">
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
          <li><a ><span class="nodeTypeColor type-color-bg">&nbsp;</span><span class="nodeTypeName">Type1</span></a></li>
        </ul>
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-btn">
        <button type="button" id="subMenuNodeEditBtn" class="btn btn-primary">Update</button>
      </div>
    </ul>

    <ul id="subMenuEdge" class="nav navbar-nav">
      <div class="sub-menu-name">
        <span>Edge : </span>
      </div>
      <div class="btn-group">
        <div id="subMenuEdgeSource" class="unselected subMenuEdgeNode">Select Source Node</div>
        <%--subMenuEdgeTarget--%>
      </div>
      <div class="sub-menu-name">
        <span> ▶ </span>
      </div>
      <div class="btn-group">
        <div id="subMenuEdgeTarget" class="unselected subMenuEdgeNode">Select Target Node</div>
        <%--<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">--%>
          <%--<span class="caret"></span>--%>
          <%--<span class="sr-only">Toggle Dropdown</span>--%>
        <%--</button>--%>
        <%--<ul id="subMenuEdgeTargetDropdown" class="dropdown-menu subMenuEdgeNodeDropdown">--%>
          <%--<li><a >Node 1</a></li>--%>
        <%--</ul>--%>
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-name">
        <span>Type : </span>
      </div>
      <div class="btn-group">
        <div id="subMenuEdgeType" class="btn btn-default btn-selection unselected">Select Type</div>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul id="subMenuEdgeTypeDropdown" class="dropdown-menu">
          <li><a ><span class="edgeTypeColor type-color-bg">&nbsp;</span><span class="edgeTypeName">Type1</span></a></li>
        </ul>
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-name">
        <span>Influence : </span>
      </div>
      <div class="sub-menu-field">
        <input type="number" step=0.01 min=0 max=1 id="subMenuEdgeInfluence" class="form-control" placeholder="Influence"
               stype="width: 100px;">
      </div>
      <div class="sub-menu-divider"></div>
      <div class="sub-menu-btn">
        <button type="button" id="subMenuEdgeEditBtn" class="btn btn-primary">Update</button>
      </div>
    </ul>

    <ul id="subMenuNone" class="nav navbar-nav">
      <div class="sub-menu-divider"></div>
    </ul>
  </div>
</nav>

<%--<div class="zoom-menu">#}--%>
  <%--<button type="button" class="btn btn-dark zoom-menu-button">+</button>--%>
  <%--<button type="button" class="btn btn-dark zoom-menu-button">-</button>--%>
  <%--<span class="glyphicon glyphicon-search zoom-menu-icon" aria-hidden="true"></span>--%>
  <%--<input type="text" class="form-control zoom-menu-percentage" placeholder="100%">--%>
<%--</div>--%>


<div class="content">
  <nav class="side-menu no-print">
    <div class="side-menu-container">
      <div class="side-menu-list side-menu-nodes">
        <div class="side-menu-list-header">
          <h5>List of Nodes</h5>
          <div class="btn-group" role="group">
            <a class="btn btn-dark btn-xs menuDeleteNode" aria-label="Delete Node">
              <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
            </a>
            <a class="btn btn-dark btn-xs menuNewNode" aria-label="Add Node">
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </a>
          </div>
        </div>
        <ul id="sideMenuNodeList">
          <li><a><span>New Node 1</span></a></li>
          <li><a><span>New Node 2</span></a></li>
          <li><a><span>New Node 3</span></a></li>
          <li><a><span>New Node 4</span></a></li>
        </ul>
      </div>

      <div class="side-menu-list side-menu-edges">
        <div class="side-menu-list-header">
          <h5>List of Edges</h5>
          <div class="btn-group" role="group">
            <a class="btn btn-dark btn-xs menuDeleteEdge" aria-label="Delete Edge">
              <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
            </a>
            <a class="btn btn-dark btn-xs menuNewEdge" aria-label="Add Edge">
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </a>
          </div>
        </div>
        <ul id="sideMenuEdgeList">
          <li><a><span class="edge-source">Node A</span>
            <span class="edge-pointer">-></span>
            <span class="edge-target">Node B</span></a></li>
          <li><a><span class="edge-source">Node B</span>
            <span class="edge-pointer">-></span>
            <span class="edge-target">Node A</span></a></li>
          <li><a><span class="edge-source">Node A</span>
            <span class="edge-pointer">-></span>
            <span class="edge-target">Node C</span></a></li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="graph-area">
    <div class="graph-title no-print">
      <span id="graphName">New Graph</span>
      <div class="btn-group" role="group">
        <a id="editGraphName" class="btn btn-dark btn-xs" aria-label="Edit Name">
          <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
        </a>
        <a id="deleteGraph" class="btn btn-dark btn-xs" aria-label="Delete Graph">
          <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </a>
        <a id="closeGraph" class="btn btn-dark btn-xs" aria-label="Close Graph">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </div>
    </div>
    <div class="yes-print" id="graph"></div>
  </div>

  <div class="graph-close-overlay">
    <h4>Please load a graph or create new graph first.</h4>
  </div>
</div>

<div class="welcome-overlay">
  <h2>Welcome to Influence Network Analytics Service!</h2>
</div>


<!-- Modals -->
<div id="signupModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Sign Up for Influence Network</h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-12">
            <form id="signupForm" class="form-signup"  name="signupForm" accept-charset="UTF-8" method="POST">
              <div class="form-group">
                <label for="inputEmail" >Email Address</label>
                <input type="email" id="inputEmail" name="email" maxlength="100"
                       <%--class="form-control form-control-input valid"--%>
                       class="form-control valid"
                       placeholder="Email" required>
                <%--<button type="button" id="btnCheckEmail" class="btn btn-dark btn-block--%>
                        <%--form-control form-control-button">Check</button>--%>
              </div>
              <div class="form-group">
                <label for="inputPw">Password</label>
                <input type="password" id="inputPw" name="pw" maxlength="20" class="form-control invalid"
                       placeholder="Password" required>
              </div>
              <div class="form-group">
                <label for="inputPwConfirm">Password Confirm</label>
                <input type="password" id="inputPwConfirm" maxlength="20" name="pwConfirm" class="form-control"
                       placeholder="Password Confirm" required>
              </div>
              <div class="form-group">
                <label for="inputName" >Name</label>
                <input type="text" id="inputName" name="inputName" maxlength="40" class="form-control valid"
                       placeholder="Name" required>
              </div>
              <div class="row">
                <div class="col-xs-6">
                  <button id="btnSignupCancel" data-dismiss="modal"
                          class="btn btn-default btn-block" type="button">Cancel</button>
                </div>
                <div class="col-xs-6">
                  <button id="btnSignup" class="btn btn-dark btn-block"
                          type="submit">Sign up</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="editInfoModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Edit My Information</h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-12">
            <form id="editInfoForm" class="form-editInfo"  name="editInfoForm" accept-charset="UTF-8" method="POST">
              <div class="form-group">
                <label for="inputEmail" >Email Address</label>
                <input type="email" id="editInfoInputEmail" name="email" maxlength="100"
                <%--class="form-control form-control-input valid"--%>
                       class="form-control valid"
                       placeholder="Email" required readonly="readonly">
                <%--<button type="button" id="btnCheckEmail" class="btn btn-dark btn-block--%>
                <%--form-control form-control-button">Check</button>--%>
              </div>
              <div class="form-group">
                <label for="inputPw">Password</label>
                <input type="password" id="editInfoInputPw" name="pw" maxlength="20" class="form-control invalid"
                       placeholder="Password">
              </div>
              <div class="form-group">
                <label for="inputPwConfirm">Password Confirm</label>
                <input type="password" id="editInfoInputPwConfirm" maxlength="20" name="pwConfirm" class="form-control"
                       placeholder="Password Confirm">
              </div>
              <div class="form-group">
                <label for="inputName" >Name</label>
                <input type="text" id="editInfoInputName" name="inputName" maxlength="40" class="form-control valid"
                       placeholder="Name">
              </div>
              <div class="row">
                <div class="col-xs-6">
                  <button id="btnEditInfoCancel" data-dismiss="modal"
                          class="btn btn-default btn-block" type="button">Cancel</button>
                </div>
                <div class="col-xs-6">
                  <button id="btnEditInfo" class="btn btn-dark btn-block"
                          type="submit">Apply</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="findPasswordModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Find Your Password</h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-12">
            <form id="findPasswordForm" class="form-findPassword"  name="findPasswordForm" accept-charset="UTF-8" method="POST">
              <div class="form-group">
                <label for="inputEmail" >Email Address</label>
                <input type="email" id="findPasswordInputEmail" name="email" maxlength="100"
                       class="form-control valid"
                       placeholder="Email" required>
              </div>
              <div class="row">
                <div class="col-xs-6">
                  <button id="btnFindPasswordCancel" data-dismiss="modal"
                          class="btn btn-default btn-block" type="button">Cancel</button>
                </div>
                <div class="col-xs-6">
                  <button id="btnFindPassword" class="btn btn-dark btn-block"
                          type="submit">Find</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div id="newEdgeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">New Edge</h4>
      </div>
      <div class="modal-body">
        <div>
          <span>Source Node</span><br/>
          <div class="btn-group">
            <div id="newEdgeDlgSource" class="btn btn-default btn-selection long-length unselected newEdgeDlgNode">Select Source Node</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="newEdgeDlgSourceDropdown" class="dropdown-menu newEdgeDlgNodeDropdown">
              <li><a >Node 1</a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <span>Target Node</span><br/>
          <div class="btn-group">
            <div id="newEdgeDlgTarget" class="btn btn-default btn-selection long-length unselected newEdgeDlgNode">Select Target Node</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="newEdgeDlgTargetDropdown" class="dropdown-menu newEdgeDlgNodeDropdown">
              <li><a >Node 1</a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <span>Edge Type</span><br/>
          <div class="btn-group">
            <div id="newEdgeDlgType" class="btn btn-default btn-selection long-length unselected">Select Type</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="newEdgeDlgTypeDropdown" class="dropdown-menu">
              <li><a ><span class="edgeTypeColor type-color-bg">&nbsp;</span><span class="edgeTypeName">Type1</span></a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <span>Influence (0 to 1)</span>
          <input type="number" value=0.5 step=0.01 min=0 max=1 id="newEdgeDlgInfluence" class="form-control">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnNewEdgeModalConfirm" class="btn btn-dark">Add</button>
      </div>
    </div>
  </div>
</div>

<div id="manageNodeTypeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
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
              <a  class="list-group-item active">Type 1</a>
              <a  class="list-group-item">Type 2</a>
            </div>
            <span class="unfocusor" style="display: none;">&nbsp;</span>
          </div>
          <div class="col-xs-4">
            <div>
              <h5>Select Color</h5>
            </div>
            <div id="manageNodeTypeColorList" class="list-group">
              <a  class="list-group-item active" data-color="red">Red <span class="typeColor type-color-bg type-color-red">&nbsp;</span></a>
              <a  class="list-group-item" data-color="pink">Pink <span class="typeColor type-color-bg type-color-pink">&nbsp;</span></a>
              <a  class="list-group-item" data-color="purple">Purple <span class="typeColor type-color-bg type-color-purple">&nbsp;</span></a>
              <a  class="list-group-item" data-color="deep-purple">Deep Purple <span class="typeColor type-color-bg type-color-deep-purple">&nbsp;</span></a>
              <a  class="list-group-item" data-color="indigo">Indigo <span class="typeColor type-color-bg type-color-indigo">&nbsp;</span></a>
              <a  class="list-group-item" data-color="blue">Blue <span class="typeColor type-color-bg type-color-blue">&nbsp;</span></a>
              <a  class="list-group-item" data-color="light-blue">Light Blue <span class="typeColor type-color-bg type-color-light-blue">&nbsp;</span></a>
              <a  class="list-group-item" data-color="cyan">Cyan <span class="typeColor type-color-bg type-color-cyan">&nbsp;</span></a>
              <a  class="list-group-item" data-color="teal">Teal <span class="typeColor type-color-bg type-color-teal">&nbsp;</span></a>
              <a  class="list-group-item" data-color="green">Green <span class="typeColor type-color-bg type-color-green">&nbsp;</span></a>
              <a  class="list-group-item" data-color="light-green">Light Green <span class="typeColor type-color-bg type-color-light-green">&nbsp;</span></a>
              <a  class="list-group-item" data-color="lime">Lime <span class="typeColor type-color-bg type-color-lime">&nbsp;</span></a>
              <a  class="list-group-item" data-color="yellow">Yellow <span class="typeColor type-color-bg type-color-yellow">&nbsp;</span></a>
              <a  class="list-group-item" data-color="amber">Amber <span class="typeColor type-color-bg type-color-amber">&nbsp;</span></a>
              <a  class="list-group-item" data-color="orange">Orange <span class="typeColor type-color-bg type-color-orange">&nbsp;</span></a>
              <a  class="list-group-item" data-color="deep-orange">Deep Orange <span class="typeColor type-color-bg type-color-deep-orange">&nbsp;</span></a>
              <a  class="list-group-item" data-color="brown">Brown <span class="typeColor type-color-bg type-color-brown">&nbsp;</span></a>
              <a  class="list-group-item" data-color="grey">Grey <span class="typeColor type-color-bg type-color-grey">&nbsp;</span></a>
              <a  class="list-group-item" data-color="blue-grey">Blue Grey <span class="typeColor type-color-bg type-color-blue-grey">&nbsp;</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div id="manageEdgeTypeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Manage Edge Type</h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-8">
            <div class="list-header">
              <h5>Node Types</h5>
              <div class="btn-group" role="group">
                <a id="btnDeleteEdgeType" class="btn btn-default btn-xs" aria-label="Delete Edge Type">
                  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </a>
                <a id="btnEditEdgeTypeName" class="btn btn-default btn-xs" aria-label="Edit Edge Type Name">
                  <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </a>
                <a id="btnAddEdgeType" class="btn btn-default btn-xs" aria-label="Add Edge Type">
                  <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </a>
              </div>
            </div>
            <div id="manageEdgeTypeList" class="list-group">
              <a  class="list-group-item active">Type 1</a>
              <a  class="list-group-item">Type 2</a>
            </div>
            <span class="unfocusor" style="display: none;">&nbsp;</span>
          </div>
          <div class="col-xs-4">
            <div>
              <h5>Select Color</h5>
            </div>
            <div id="manageEdgeTypeColorList" class="list-group">
              <a  class="list-group-item active" data-color="red">Red <span class="typeColor type-color-bg type-color-red">&nbsp;</span></a>
              <a  class="list-group-item" data-color="pink">Pink <span class="typeColor type-color-bg type-color-pink">&nbsp;</span></a>
              <a  class="list-group-item" data-color="purple">Purple <span class="typeColor type-color-bg type-color-purple">&nbsp;</span></a>
              <a  class="list-group-item" data-color="deep-purple">Deep Purple <span class="typeColor type-color-bg type-color-deep-purple">&nbsp;</span></a>
              <a  class="list-group-item" data-color="indigo">Indigo <span class="typeColor type-color-bg type-color-indigo">&nbsp;</span></a>
              <a  class="list-group-item" data-color="blue">Blue <span class="typeColor type-color-bg type-color-blue">&nbsp;</span></a>
              <a  class="list-group-item" data-color="light-blue">Light Blue <span class="typeColor type-color-bg type-color-light-blue">&nbsp;</span></a>
              <a  class="list-group-item" data-color="cyan">Cyan <span class="typeColor type-color-bg type-color-cyan">&nbsp;</span></a>
              <a  class="list-group-item" data-color="teal">Teal <span class="typeColor type-color-bg type-color-teal">&nbsp;</span></a>
              <a  class="list-group-item" data-color="green">Green <span class="typeColor type-color-bg type-color-green">&nbsp;</span></a>
              <a  class="list-group-item" data-color="light-green">Light Green <span class="typeColor type-color-bg type-color-light-green">&nbsp;</span></a>
              <a  class="list-group-item" data-color="lime">Lime <span class="typeColor type-color-bg type-color-lime">&nbsp;</span></a>
              <a  class="list-group-item" data-color="yellow">Yellow <span class="typeColor type-color-bg type-color-yellow">&nbsp;</span></a>
              <a  class="list-group-item" data-color="amber">Amber <span class="typeColor type-color-bg type-color-amber">&nbsp;</span></a>
              <a  class="list-group-item" data-color="orange">Orange <span class="typeColor type-color-bg type-color-orange">&nbsp;</span></a>
              <a  class="list-group-item" data-color="deep-orange">Deep Orange <span class="typeColor type-color-bg type-color-deep-orange">&nbsp;</span></a>
              <a  class="list-group-item" data-color="brown">Brown <span class="typeColor type-color-bg type-color-brown">&nbsp;</span></a>
              <a  class="list-group-item" data-color="grey">Grey <span class="typeColor type-color-bg type-color-grey">&nbsp;</span></a>
              <a  class="list-group-item" data-color="blue-grey">Blue Grey <span class="typeColor type-color-bg type-color-blue-grey">&nbsp;</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div id="manageConfidenceModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
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
      </div>
    </div>
  </div>
</div>

<div id="manageEdgeTypeViewModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Edge Type View Setting</h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-12">
            <div class="list-header">
              <h5>Node Types</h5>
            </div>
            <div id="manageEdgeTypeViewList" class="list-group">
              <a  class="list-group-item active">Type 1</a>
              <a  class="list-group-item">Type 2</a>
            </div>
          </div>
        </div>
        <div class="checkbox" style="margin: 0;">
          <label style="font-weight: normal; margin: 0;">
            <input id="checkboxAllEdgeTypeView" type="checkbox" value="remember"> Show All Edge Types
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnManageEdgeTypeViewModal" class="btn btn-dark">Apply</button>
      </div>
    </div>
  </div>
</div>

<div id="newGraphModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">New Graph</h4>
      </div>
      <div class="modal-body">
        <div>
          <h5>Graph Name</h5>
          <input type="text" id="newGraphName" class="form-control" placeholder="New Graph Name">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnNewGraph" class="btn btn-dark">Create</button>
      </div>
    </div>
  </div>
</div>

<div id="openGraphModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Open Graph</h4>
      </div>
      <div class="modal-body">
        <div>
          <h5>Influence Graph List</h5>
          <div id="graphList" class="list-group">
            <a  class="list-group-item active">Type 1</a>
            <a  class="list-group-item">Type 2</a>
          </div>
          <span class="unfocusor" style="display: none;">&nbsp;</span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnOpenGraph" class="btn btn-dark" >Open</button>
      </div>
    </div>
  </div>
</div>

<div id="saveAsGraphModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Save As</h4>
      </div>
      <div class="modal-body">
        <div>
          <h5>Graph Name</h5>
          <input type="text" id="saveAsGraphName" class="form-control" placeholder="Graph Name">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnSaveAsGraph" class="btn btn-dark">Save As</button>
      </div>
    </div>
  </div>
</div>

<div id="findMaxInfPathModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Find Max Influence Path</h4>
      </div>
      <div class="modal-body">
        <div>
          <span>Source Node</span><br/>
          <div class="btn-group">
            <div id="findMaxInfDlgSource" class="btn btn-default btn-selection long-length unselected findMaxInfDlgNode">Select Source Node</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="findMaxInfDlgSourceDropdown" class="dropdown-menu findMaxInfDlgNodeDropdown">
              <li><a >Node 1</a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <span>Target Node</span><br/>
          <div class="btn-group">
            <div id="findMaxInfDlgTarget" class="btn btn-default btn-selection long-length unselected findMaxInfDlgNode">Select Target Node</div>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul id="findMaxInfDlgTargetDropdown" class="dropdown-menu findMaxInfDlgNodeDropdown">
              <li><a >Node 1</a></li>
            </ul>
          </div>
        </div>
        <br/>
        <div>
          <div class="edgetype-div">
            <span>Edge Type</span><br/>
            <div class="edgetype-checkbox-group"></div>
          </div>
          <div class="edgetype-div2">
            <input class="checkbox-all" type="checkbox" checked><span>All</span>
          </div>
          <div class="etc-div">
            <span>ETC</span><br/>
            <div><input class="checkbox-confidence" type="checkbox" checked><span>Confidence</span></div>
            <div><input class="checkbox-average" type="checkbox" checked><span>Average</span></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnFindMaxInfPathConfirm" class="btn btn-dark">Find</button>
      </div>
    </div>
  </div>
</div>

<div id="findMostSumInfNodeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Find Most Sum Influence Node</h4>
      </div>
      <div class="modal-body">
        <div>
          <span>Node Number</span><br/>
          <div>
            <input type="number" step=1 min=1 max=1000 id="mostSumInfNodeNumber" class="form-control" placeholder="Node Number"
                   style="width: 200px;">
          </div>
        </div>
        <br/>
        <div>
          <div class="edgetype-div">
            <span>Edge Type</span><br/>
            <div class="edgetype-checkbox-group"></div>
          </div>
          <div class="edgetype-div2">
            <input class="checkbox-all" type="checkbox" checked><span>All</span>
          </div>
          <div class="etc-div">
            <span>ETC</span><br/>
            <input class="checkbox-confidence" type="checkbox" checked><span>Confidence</span>
            <input class="checkbox-average" type="checkbox" checked><span>Average</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnFindSumInfNodeConfirm" class="btn btn-dark">Find</button>
      </div>
    </div>
  </div>
</div>

<div id="findMostAvgInfNodeModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Find Most Average Influence Node</h4>
      </div>
      <div class="modal-body">
        <div>
          <span>Node Number</span><br/>
          <div>
            <input type="number" step=1 min=1 max=1000 id="mostAvgInfNodeNumber" class="form-control" placeholder="Node Number"
                   style="width: 200px;">
          </div>
        </div>
        <br/>
        <div>
          <div class="edgetype-div">
            <span>Edge Type</span><br/>
            <div class="edgetype-checkbox-group"></div>
          </div>
          <div class="edgetype-div2">
            <input class="checkbox-all" type="checkbox" checked><span>All</span>
          </div>
          <div class="etc-div">
            <span>ETC</span><br/>
            <input class="checkbox-confidence" type="checkbox" checked><span>Confidence</span>
            <input class="checkbox-average" type="checkbox" checked><span>Average</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnFindAvgInfNodeConfirm" class="btn btn-dark">Find</button>
      </div>
    </div>
  </div>
</div>

<div id="findAllMaxInfModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Find Max Influence Table</h4>
      </div>
      <div class="modal-body">
        <div>
          <div class="edgetype-div">
            <span>Edge Type</span><br/>
            <div class="edgetype-checkbox-group"></div>
          </div>
          <div class="edgetype-div2">
            <input class="checkbox-all" type="checkbox" checked><span>All</span>
          </div>
          <div class="etc-div">
            <span>ETC</span><br/>
            <input class="checkbox-confidence" type="checkbox" checked><span>Confidence</span>
            <input class="checkbox-average" type="checkbox" checked><span>Average</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnFindAllMaxInfConfirm" class="btn btn-dark">Find</button>
      </div>
    </div>
  </div>
</div>

<div id="confirmModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 id="confirmModalTitle" class="modal-title">Alert</h4>
      </div>
      <div class="modal-body">
        <p id="confirmModalMsg">message</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button id="btnConfirmModal" type="button" class="btn btn-dark" data-dismiss="modal">Save</button>
      </div>
    </div>
  </div>
</div>

<div id="confirmModal2" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 id="confirmModalTitle2" class="modal-title">Alert</h4>
      </div>
      <div class="modal-body">
        <p id="confirmModalMsg2">message</p>
      </div>
      <div class="modal-footer">
        <button id="btnSave" type="button" class="btn btn-default" data-dismiss="modal">Save</button>
        <button id="btnDiscard" type="button" class="btn btn-dark" data-dismiss="modal">Discard</button>
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

<div id="editGraphNameModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Edit Graph Name</h4>
      </div>
      <div class="modal-body">
        <div>
          <h5>Graph Name</h5>
          <input type="text" id="inputGraphName" class="form-control">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnEditGraphName" class="btn btn-dark">Apply</button>
      </div>
    </div>
  </div>
</div>

<div id="deleteGraphModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Delete Graph</h4>
      </div>
      <div class="modal-body">
        <div>
          <p>Are you sure that this graph is deleted?</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" id="btnDeleteGraph" class="btn btn-dark">Apply</button>
      </div>
    </div>
  </div>
</div>

<div id="infPathFixedToast" class="toast fixed-toast" role="alert">
  <div class="toast-wrapper">
    <div class="toast-alert" role="document">
      <div class="toast-body">
        <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <div id="infPathFixedInfo">
          Max Influence Path from &lt;A&gt; to &lt;B&gt; <br/>
          Max Influence Value : 0.2561 <br/>
          Edge Type: Sample Type
        </div>
      </div>
    </div>
  </div>
</div>

<div id="sumInfNodeFixedToast" class="toast fixed-toast" role="alert">
  <div class="toast-wrapper">
    <div class="toast-alert" role="document">
      <div class="toast-body">
        <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <div id="sumInfNodeFixedInfo">
          Max Sum Influence Node
        </div>
      </div>
    </div>
  </div>
</div>

<div id="avgInfNodeFixedToast" class="toast fixed-toast" role="alert">
  <div class="toast-wrapper">
    <div class="toast-alert" role="document">
      <div class="toast-body">
        <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <div id="avgInfNodeFixedInfo">
          Max Average Influence Node
        </div>
      </div>
    </div>
  </div>
</div>

<div id="maxInfluenceTable" class="toast fixed-toast" role="alert">
  <div class="toast-wrapper">
    <div class="toast-alert" role="document">
      <div class="toast-body">
        <div>
          <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <button type="button" class="maximize" style="margin-right: 10px;"><span aria-hidden="true">□</span></button>
        </div>
        <div style="overflow: auto; width:100%; height:90%; margin-top: 30px;">
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
  </div>
</div>

<div id="alertToast" class="toast" role="alert">
  <div class="toast-wrapper">
    <div class="toast-alert" role="document">
      <div class="toast-body">
        <div id="alertToastMsg">Saved</div>
      </div>
    </div>
  </div>
</div>

<div id="snackbar">Saved</div>

<script src="lib/jquery/jquery-3.1.1.min.js"></script>
<script src="lib/jquery-ui/jquery-ui.js"></script>
<script src="js/jquery.cookie.js"></script>
<script src="lib/jquery/plugin/loadingoverlay.min.js"></script>
<script src="lib/jquery-hotkeys/jquery.hotkeys.js"></script>
<script src="js/jquery_extends.js"></script>
<script src="lib/bootstrap/js/bootstrap.min.js"></script>
<script src="lib/dom-to-image/dom-to-image.min.js"></script>
<script src="lib/File-Saver/FileSaver.min.js"></script>
<script src="js/cust-ui.js"></script>
<%--<script src="lib/SnackBar/snackbar.js"></script>--%>
<%--<script src="lib/d3/d3.min.js"></script>--%>
<script src="lib/d3/d3.v3.min.js" charset="utf-8"></script>
<%--<script src="lib/directed-graph-creator/graph-creator-custom.js"></script>--%>
<script src="lib/directed-graph-creator/graph-creator-custom-v2.js"></script>
<script src="lib/Tiny-Multipurpose-Dialog-Popup-Plugin-With-jQuery-dialogbox-js/js/dialogbox.js"></script>
<script src="js/main.js"></script>




</body>
</html>