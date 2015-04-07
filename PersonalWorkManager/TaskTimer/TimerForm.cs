using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace PersistableMultiTimer {
    public partial class frmTimerForm : Form {

        private enum EditMode {
            Undefined = 0,
            Add = 1,
            Edit = 2
        }
        private EditMode _editMode;
        private long _id;
        
        public frmTimerForm() {
            InitializeComponent();

            _editMode = EditMode.Undefined;
        }

        private void btnOk_Click(object sender, EventArgs e) {

            Timer timer;
            switch (_editMode) {
                case EditMode.Undefined:
                    break;
                case EditMode.Add:
                    timer = new Timer() { Name = this.txtName.Text, Description = this.txtDescription.Text };
                    using (var objCtx = new TimersDBEntities()) {
                        objCtx.Timer.AddObject(timer);
                        objCtx.SaveChanges();
                    }
                    break;
                case EditMode.Edit:
                    using (var objCtx = new TimersDBEntities()) {
                        timer = objCtx.Timer.SingleOrDefault(x => x.Id == _id);
                        timer.Name = this.txtName.Text;
                        timer.Description = this.txtDescription.Text;
                        objCtx.SaveChanges();
                    }
                    break;
                default:
                    break;
            }

        }
        private void btnCancel_Click(object sender, EventArgs e) {
            this.Close();
        }

        public DialogResult ShowAdd(Form Owner) {

            _editMode = EditMode.Add;
            this.txtName.Text = "";
            this.txtDescription.Text = "";
            return this.ShowDialog(Owner);

        }
        public DialogResult ShowEdit(Form Owner, long IdTimer) {

            _editMode = EditMode.Edit;
            _id = IdTimer;

            TimersDBEntities db = new TimersDBEntities();
            var timer = db.Timer.SingleOrDefault(x => x.Id == _id);

            this.txtName.Text = timer.Name;
            this.txtDescription.Text = timer.Description;
            return this.ShowDialog(Owner);
        }

    }
}
