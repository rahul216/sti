import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Database, Palette, Bell, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6" data-testid="settings-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Platform Settings</h2>
          <p className="text-muted-foreground">Configure your multi-omics analysis environment</p>
        </div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">System Configuration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Analysis Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-save Analysis Results</p>
                <p className="text-sm text-muted-foreground">Automatically save predictions and visualizations</p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-save" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Default ML Model Confidence Threshold</label>
              <Select defaultValue="0.7">
                <SelectTrigger data-testid="select-confidence-threshold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">50% - More sensitive</SelectItem>
                  <SelectItem value="0.7">70% - Balanced</SelectItem>
                  <SelectItem value="0.9">90% - High confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Batch Processing</p>
                <p className="text-sm text-muted-foreground">Process multiple datasets simultaneously</p>
              </div>
              <Switch defaultChecked data-testid="switch-batch-processing" />
            </div>
          </CardContent>
        </Card>

        {/* Interface Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Interface Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Scheme</label>
              <Select defaultValue="scientific">
                <SelectTrigger data-testid="select-color-scheme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scientific">Scientific (Current)</SelectItem>
                  <SelectItem value="classic">Classic Blue</SelectItem>
                  <SelectItem value="nature">Nature Green</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Network Animations</p>
                <p className="text-sm text-muted-foreground">Animate network visualization changes</p>
              </div>
              <Switch defaultChecked data-testid="switch-animations" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dense Data Tables</p>
                <p className="text-sm text-muted-foreground">Show more rows per page</p>
              </div>
              <Switch data-testid="switch-dense-tables" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-medium">Storage Usage</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Datasets</span>
                    <span>4.2 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-cleanup Old Results</p>
                  <p className="text-sm text-muted-foreground">Remove analysis results older than 30 days</p>
                </div>
                <Switch data-testid="switch-auto-cleanup" />
              </div>

              <Button variant="outline" className="w-full" data-testid="button-cleanup-now">
                Clean Up Storage Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Encryption</p>
                <p className="text-sm text-muted-foreground">Encrypt stored datasets</p>
              </div>
              <Badge className="bg-scientific-green text-white">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Audit Logging</p>
                <p className="text-sm text-muted-foreground">Track data access and modifications</p>
              </div>
              <Switch defaultChecked data-testid="switch-audit-logging" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Retention Period</label>
              <Select defaultValue="1year">
                <SelectTrigger data-testid="select-retention-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analysis Complete</p>
                <p className="text-sm text-muted-foreground">Notify when predictions finish</p>
              </div>
              <Switch defaultChecked data-testid="switch-notify-analysis" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dataset Upload</p>
                <p className="text-sm text-muted-foreground">Notify on successful uploads</p>
              </div>
              <Switch defaultChecked data-testid="switch-notify-upload" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Alerts</p>
                <p className="text-sm text-muted-foreground">Important system messages</p>
              </div>
              <Switch defaultChecked data-testid="switch-notify-system" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" data-testid="button-reset-settings">
          Reset to Defaults
        </Button>
        <Button data-testid="button-save-settings">
          Save Changes
        </Button>
      </div>
    </div>
  );
}