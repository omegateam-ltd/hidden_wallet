'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Shield, Lock, Eye, Zap } from 'lucide-react';

type SecurityLevel = 'basic' | 'standard' | 'high';

interface SecuritySettingsProps {
  currentLevel: SecurityLevel;
  onLevelChange: (level: SecurityLevel) => void;
}

export function SecuritySettings({ currentLevel, onLevelChange }: SecuritySettingsProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async (level: SecurityLevel) => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('security-level', level);
      onLevelChange(level);
      // In a real app, this would also update the wallet configuration
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      console.error('Failed to save security settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const levels: Array<{
    value: SecurityLevel;
    label: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
  }> = [
    {
      value: 'basic',
      label: 'Basic',
      description: 'Minimal protection with basic encryption',
      icon: <Lock className="h-5 w-5" />,
      features: [
        'AES-256 encryption',
        'Basic address obfuscation',
        'Direct transactions'
      ]
    },
    {
      value: 'standard',
      label: 'Standard',
      description: 'Balanced protection with transaction mixing',
      icon: <Shield className="h-5 w-5" />,
      features: [
        'AES-256 encryption',
        'Traffic obfuscation',
        'Single-hop mixing',
        'Random delays'
      ]
    },
    {
      value: 'high',
      label: 'High',
      description: 'Maximum protection with multi-layer privacy',
      icon: <Eye className="h-5 w-5" />,
      features: [
        'AES-256-GCM encryption',
        'Multi-hop mixing',
        'Decentralized routing',
        'Full metadata protection',
        'Proxy network'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Security Level</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred security and privacy level
        </p>
      </div>

      <div className="grid gap-4">
        {levels.map((level) => (
          <div
            key={level.value}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              currentLevel === level.value
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleSave(level.value)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${
                  currentLevel === level.value ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {level.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{level.label}</h4>
                    {currentLevel === level.value && (
                      <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {level.description}
                  </p>
                  <ul className="space-y-1">
                    {level.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <Zap className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {saving && (
        <div className="text-sm text-muted-foreground text-center">
          Saving settings...
        </div>
      )}
    </div>
  );
}

