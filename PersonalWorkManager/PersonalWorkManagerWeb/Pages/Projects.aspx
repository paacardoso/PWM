﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="Projects.aspx.cs" Inherits="PersonalWorkManagerWeb.Pages.Projects" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <asp:ScriptManagerProxy ID="ScriptManagerProxy1" runat="server">
        <Scripts>
            <asp:ScriptReference Path="Projects.js" />
            <asp:ScriptReference Path="ProjectTasks.js" />
            <asp:ScriptReference Path="ProjectAlerts.js" />
        </Scripts>
    </asp:ScriptManagerProxy>
    <div class="row">
        <div class="col-sm-12">
            <h1 class="page-header">Projectos</h1>
        </div>
    </div>

    <div id="div1" class="container-fluid">
        <div class="form-horizontal">
            <div class="form-group">
                <label class="control-label col-sm-1" for="ddlProject">Projecto: </label>
                <div class="input-group col-sm-11">
                    <select id="ddlProject" placeholder="Escolha um projecto ..."></select>
                    <span class="input-group-addon" onclick="Projects.newProject();">
                        <span class="glyphicon glyphicon-plus"></span>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div id="divMain" class="panel panel-default container-fluid">
        <p></p>
        <ul class="nav nav-tabs" id="tabProject">
            <li class="active"><a href="#tabMain" id="ancMain" data-toggle="tab">Projecto</a></li>
            <li><a href="#tabTasks" id="ancTasks" data-toggle="tab">Tarefas</a></li>
            <li><a href="#tabAlerts" id="ancAlerts" data-toggle="tab">Alertas</a></li>
            <li><a href="#tabNotes" id="ancNotes" data-toggle="tab">Notas</a></li>
            <li><a href="#tabSessions" id="ancSessions" data-toggle="tab">Sessões</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="tabMain">
                <p></p>
                <div id="tlbProject" class="btn-group btn-group-md">
                    <button id="btnProjectSave" type="button" class="btn btn-default" onclick="Projects.saveProject();">
                        <i class="glyphicon glyphicon-floppy-save"></i>&nbsp;Guardar
                    </button>
                    <button id="btnProjectRemove" type="button" class="btn btn-default" onclick="Projects.removeProject();">
                        <i class="glyphicon glyphicon-remove"></i>&nbsp;Remover
                    </button>
                    <button id="btnProjectCancel" type="button" class="btn btn-default" onclick="Projects.cancelNewProject();">
                        <i class="glyphicon glyphicon-arrow-left"></i>&nbsp;Cancelar
                    </button>
                </div>
                <p></p>
                <div class="form-horizontal">
                    <input type="hidden" id="txtId"/>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="txtCode">Código: </label>
                        <div class="col-md-2">
                            <input type="text" class="form-control" id="txtCode" placeholder="Código">
                        </div>
                        <label class="control-label col-sm-1" for="txtName">Nome: </label>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" id="txtName" placeholder="Nome">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="txtDescription">Descrição: </label>
                        <div class="col-sm-10">
                            <textarea class="form-control" rows="5" id="txtDescription" placeholder="Descrição"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="txtStartDate">Data Inicio: </label>
                        <div class="col-md-4">
                            <div class="input-group" id="txtStartDate">
                                <input type="text" class="form-control" placeholder="Data Início">
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                        </div>
                        <label class="control-label col-sm-2" for="txtEndDate">Data Fim: </label>
                        <div class="col-md-4">
                            <div class="input-group" id="txtEndDate">
                                <input type="text" class="form-control" placeholder="Data Fim">
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="ddlStatus">Estado: </label>
                        <div class="col-sm-10">
                            <select class="form-control" id="ddlStatus">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane" id="tabTasks">
                <div id="tlbTasks" class="btn-group btn-group-md">
                    <button id="btnTaskRefresh" type="button" class="btn btn-default" onclick="ProjectTasks.getTasks();">
                        <i class="glyphicon glyphicon-refresh"></i>&nbsp;Actualizar
                    </button>
                    <button id="btnTaskAdd" type="button" class="btn btn-default" onclick="ProjectTasks.showAddDialog();">
                        <i class="glyphicon glyphicon-plus"></i>&nbsp;Nova
                    </button>
                    <button id="btnTaskEdit" type="button" class="btn btn-default" onclick="ProjectTasks.showEditDialog();">
                        <i class="glyphicon glyphicon-edit"></i>&nbsp;Editar
                    </button>
                    <button id="btnTaskRemove" type="button" class="btn btn-default" onclick="ProjectTasks.showRemoveDialog();">
                        <i class="glyphicon glyphicon-remove"></i>&nbsp;Remover
                    </button>
                </div>
                <table id="tblTasks" 
                   class="table table-striped table-bordered table-condensed"
                   data-search="true"
                   data-pagination="true"
                   data-show-toggle="true"
                   data-show-columns="true"
                   data-sort-name="Id"
                   data-sort-order="asc"
                   data-toolbar="#tlbTasks"
                   data-click-to-select="true">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="Id" data-sortable="true">Id</th>
                    <th data-field="Name" data-sortable="true">Nome</th>
                    <th data-field="Description" data-sortable="true">Descrição</th>
                    <th data-field="Order" data-sortable="true">Ordem</th>
                    <th data-field="Status" data-sortable="true">Estado</th>
                    <th data-field="action" data-formatter="ProjectTasks.actionFormatter" data-events="actionEvents">Acção</th>
                </tr>
                </thead>
            </table>
            </div>
            <div class="tab-pane" id="tabAlerts">
                <div id="tlbAlerts" class="btn-group btn-group-md">
                    <button id="btnAlertRefresh" type="button" class="btn btn-default" onclick="ProjectAlerts.getAlerts();">
                        <i class="glyphicon glyphicon-refresh"></i>&nbsp;Actualizar
                    </button>
                    <button id="btnAlertAdd" type="button" class="btn btn-default" onclick="ProjectAlerts.showAddDialog();">
                        <i class="glyphicon glyphicon-plus"></i>&nbsp;Novo
                    </button>
                    <button id="btnAlertEdit" type="button" class="btn btn-default" onclick="ProjectAlerts.showEditDialog();">
                        <i class="glyphicon glyphicon-edit"></i>&nbsp;Editar
                    </button>
                    <button id="btnAlertRemove" type="button" class="btn btn-default" onclick="ProjectAlerts.showRemoveDialog();">
                        <i class="glyphicon glyphicon-remove"></i>&nbsp;Remover
                    </button>
                </div>
                <table id="tblAlerts" 
                   class="table table-striped table-bordered table-condensed"
                   data-search="true"
                   data-pagination="true"
                   data-show-toggle="true"
                   data-show-columns="true"
                   data-sort-name="Id"
                   data-sort-order="asc"
                   data-toolbar="#tlbAlerts"
                   data-click-to-select="true">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="Id" data-sortable="true">Id</th>
                    <th data-field="Name" data-sortable="true">Nome</th>
                    <th data-field="Description" data-sortable="true">Descrição</th>
                    <th data-field="DueDate" data-sortable="true" data-formatter="ProjectAlerts.dueDateFormatter">Data</th>
                    <th data-field="action" data-formatter="ProjectAlerts.actionFormatter" data-events="actionEvents">Acção</th>
                </tr>
                </thead>
            </table>
            </div>
            <div class="tab-pane" id="tabNotes">
                ... Notas ...
            </div>
            <div class="tab-pane" id="tabSessions">
                ... Sessões ...
            </div>
        </div>
    </div>

    <!-- Tasks Modal -->
    <div class="modal fade" id="mdlTask" tabindex="-1" role="dialog" aria-labelledby="mdlTaskLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="mdlTaskLabel"></h4>
                </div>
                <div class="modal-body">
                    <div id="divTaskModalMessage"></div>
                    <form>
                        <input type="hidden" id="txtTaskId" />
                        <div class="form-group">
                            <label class="control-label" for="txtTaskName">Nome: </label>
                            <input type="text" class="form-control" id="txtTaskName" placeholder="Nome" />
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="txtTaskDescription">Descrição: </label>
                            <input type="text" class="form-control" id="txtTaskDescription" placeholder="Descrição" />
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="txtTaskOrder">Ordem: </label>
                            <input type="text" class="form-control" id="txtTaskOrder" placeholder="Ordem" />
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="ddlTaskStatus">Estado: </label>
                            <select class="form-control" id="ddlTaskStatus">
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        Cancelar</button>
                    <button id="btnTaskActionConfirmed" type="button" class="btn btn-primary">
                        Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Alerts Modal -->
    <div class="modal fade" id="mdlAlert" tabindex="-1" role="dialog" aria-labelledby="mdlAlertLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="mdlAlertLabel"></h4>
                </div>
                <div class="modal-body">
                    <div id="divAlertModalMessage"></div>
                    <form>
                        <input type="hidden" id="txtAlertId" />
                        <div class="form-group">
                            <label class="control-label" for="txtAlertName">Nome: </label>
                            <input type="text" class="form-control" id="txtAlertName" placeholder="Nome" />
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="txtAlertDescription">Descrição: </label>
                            <input type="text" class="form-control" id="txtAlertDescription" placeholder="Descrição" />
                        </div>
                        <label class="control-label" for="txtAlertDueDate">Data: </label>
                        <div class="input-group" id="txtAlertDueDate">
                            <input type="text" class="form-control" placeholder="Data">
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        Cancelar</button>
                    <button id="btnAlertActionConfirmed" type="button" class="btn btn-primary">
                        Guardar</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
