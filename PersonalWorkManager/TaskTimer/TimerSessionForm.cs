using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace PersistableMultiTimer {
    public partial class frmTimerSessionForm : Form {

        private enum EditMode {
            Undefined = 0,
            Add = 1,
            Edit = 2
        }
        private EditMode _editMode;
        private long _idTimer;
        private long _idTimerSession;

        public frmTimerSessionForm() {
            InitializeComponent();

            _editMode = EditMode.Undefined;
        }

        private void dtpStartDate_Validating(object sender, CancelEventArgs e) {
            if (this.dtpStartDate.Value > this.dtpEndDate.Value) {
                MessageBox.Show("Start Date must be before End date.");
                e.Cancel = true;
            }                
        }
        private void dtpStartDate_ValueChanged(object sender, EventArgs e) {
            if (this.dtpStartDate.Value <= this.dtpEndDate.Value) {
                TimeSpan sessionTime = this.dtpEndDate.Value.Subtract(this.dtpStartDate.Value);
                this.dtpSessionTime.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, sessionTime.Hours, sessionTime.Minutes, sessionTime.Seconds);
            }
        }
        private void dtpEndDate_Validating(object sender, CancelEventArgs e) {
            if (this.dtpEndDate.Value < this.dtpStartDate.Value) {
                MessageBox.Show("End Date must be before Start date.");
                e.Cancel = true;
            }
        }
        private void dtpEndDate_ValueChanged(object sender, EventArgs e) {
            if (this.dtpEndDate.Value >= this.dtpStartDate.Value) {
                TimeSpan sessionTime = this.dtpEndDate.Value.Subtract(this.dtpStartDate.Value);
                this.dtpSessionTime.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, sessionTime.Hours, sessionTime.Minutes, sessionTime.Seconds);
            }
        }

        private void btnOk_Click(object sender, EventArgs e) {

            TimerSession timerSession;
            TimeSpan sessionTime = this.dtpEndDate.Value.Subtract(this.dtpStartDate.Value);
            switch (_editMode) {
                case EditMode.Undefined:
                    break;
                case EditMode.Add:
                    using (var objCtx = new TimersDBEntities()) {
                        timerSession = new TimerSession() { StartDate = this.dtpStartDate.Value, EndDate = this.dtpEndDate.Value, TotalSeconds = Convert.ToInt64(sessionTime.TotalSeconds), IdTimer = _idTimer };
                        objCtx.TimerSession.AddObject(timerSession);
                        objCtx.SaveChanges();
                    }
                    break;
                case EditMode.Edit:
                    using (var objCtx = new TimersDBEntities()) {
                        timerSession = objCtx.TimerSession.SingleOrDefault(x => x.Id == _idTimerSession);
                        timerSession.StartDate = this.dtpStartDate.Value;
                        timerSession.EndDate = this.dtpEndDate.Value;
                        timerSession.TotalSeconds = Convert.ToInt64(sessionTime.TotalSeconds);
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

        public DialogResult ShowAdd(Form Owner, long IdTimer) {

            _editMode = EditMode.Add;
            _idTimer = IdTimer;
            this.dtpStartDate.Text = "";
            this.dtpEndDate.Text = "";
            this.dtpSessionTime.Text = "00:00:00";
            return this.ShowDialog(Owner);

        }
        public DialogResult ShowEdit(Form Owner, long IdTimer, long IdTimerSession) {

            _editMode = EditMode.Edit;
            _idTimer = IdTimer;
            _idTimerSession = IdTimerSession;

            using (var objCtx = new TimersDBEntities()) {
                var timerSession = objCtx.TimerSession.SingleOrDefault(x => x.Id == _idTimerSession);
                this.dtpStartDate.Value = timerSession.StartDate;
                this.dtpEndDate.Value = timerSession.EndDate;
                TimeSpan sessionTime = TimeSpan.FromSeconds(timerSession.TotalSeconds);
                this.dtpSessionTime.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, sessionTime.Hours, sessionTime.Minutes, sessionTime.Seconds);
            }

            return this.ShowDialog(Owner);
        }

    }
}
