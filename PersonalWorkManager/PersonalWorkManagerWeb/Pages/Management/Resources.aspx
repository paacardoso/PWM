<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="Resources.aspx.cs" Inherits="PersonalWorkManagerWeb.Pages.Management.Resources" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="Resources.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">Recursos</h1>
        </div>
    </div>
    <div class="panel panel-default container-fluid">
        <div id="toolbar" class="btn-group btn-group-md">
            <button id="btnRefresh" type="button" class="btn btn-default" onclick="Resources.getResources();">
                <i class="glyphicon glyphicon-refresh"></i>&nbsp;Actualizar
            </button>
            <button id="btnAdd" type="button" class="btn btn-default" onclick="Resources.showAddDialog();">
                <i class="glyphicon glyphicon-plus"></i>&nbsp;Novo
            </button>
            <button id="btnEdit" type="button" class="btn btn-default" onclick="Resources.showEditDialog();">
                <i class="glyphicon glyphicon-edit"></i>&nbsp;Editar
            </button>
            <button id="btnRemove" type="button" class="btn btn-default" onclick="Resources.showRemoveDialog();">
                <i class="glyphicon glyphicon-remove"></i>&nbsp;Remover
            </button>
        </div>
        <table id="tblResources" 
               class="table table-striped table-bordered table-condensed"
               data-search="true"
               data-pagination="true"
               data-show-toggle="true"
               data-show-columns="true"
               data-sort-name="Id"
               data-sort-order="asc"
               data-toolbar="#toolbar"
               data-click-to-select="true">
            <thead>
            <tr>
                <th data-field="state" data-checkbox="true"></th>
                <th data-field="Id" data-sortable="true">Id</th>
                <th data-field="Login" data-sortable="true">Login</th>
                <th data-field="Name" data-sortable="true">Nome</th>
                <th data-field="Status" data-sortable="true">Estado</th>
                <th data-field="action" data-formatter="actionFormatter" data-events="actionEvents">Acção</th>
            </tr>
            </thead>
        </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="mdlResource" tabindex="-1" role="dialog" aria-labelledby="mdlLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="mdlLabel"></h4>
                </div>
                <div class="modal-body">
                    <div id="divModalMessage" style="display: none">
                    </div>
                    <form>
                        <input type="hidden" id="txtId">
                        <div class="form-group">
                            <label class="control-label" for="txtLogin">Login: </label>
                            <input type="text" class="form-control" id="txtLogin" placeholder="Login">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="txtName">Nome: </label>
                            <input type="text" class="form-control" id="txtName" placeholder="Nome">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="txtPassword">Senha: </label>
                            <input type="password" class="form-control" id="txtPassword" placeholder="Senha">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="ddlStatus">Estado: </label>
                            <select class="form-control" id="ddlStatus">
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        Cancelar</button>
                    <button id="btnActionConfirmed" type="button" class="btn btn-primary">
                        Guardar</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
