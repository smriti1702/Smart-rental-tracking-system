'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertTriangle, Clock, MapPin, User, Search, Eye, Phone, Mail, Calendar, DollarSign, TrendingUp } from './icons';

interface GhostAsset {
  id: string;
  equipment_id: string;
  equipment_type: string;
  model: string;
  manufacturer: string;
  site_name: string;
  operator_name: string;
  operator_phone: string;
  operator_email: string;
  check_out_date: string;
  planned_return_date: string;
  days_overdue: number;
  rental_rate: number;
  estimated_cost: number;
  last_known_location: string;
  status: 'overdue' | 'missing' | 'uncertain' | 'investigation';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

export default function GhostAssets() {
  const [ghostAssets, setGhostAssets] = useState<GhostAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<GhostAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Mock data for demonstration - this would come from your database
  const mockGhostAssets: GhostAsset[] = [
    {
      id: 'GA001',
      equipment_id: 'EQ001',
      equipment_type: 'Excavator',
      model: '320D',
      manufacturer: 'Caterpillar',
      site_name: 'Downtown Manhattan Construction',
      operator_name: 'John Smith',
      operator_phone: '+1-555-0123',
      operator_email: 'john.smith@construction.com',
      check_out_date: '2024-01-15',
      planned_return_date: '2024-01-20',
      days_overdue: 15,
      rental_rate: 85,
      estimated_cost: 1275,
      last_known_location: 'Brooklyn Bridge Project Site',
      status: 'overdue',
      risk_level: 'high',
      notes: 'Equipment last seen at Brooklyn Bridge site. Operator not responding to calls.'
    },
    {
      id: 'GA002',
      equipment_id: 'EQ005',
      equipment_type: 'Loader',
      model: '950K',
      manufacturer: 'Caterpillar',
      site_name: 'Manhattan West Project',
      operator_name: 'Mike Johnson',
      operator_phone: '+1-555-0456',
      operator_email: 'mike.johnson@westproject.com',
      check_out_date: '2024-01-10',
      planned_return_date: '2024-01-12',
      days_overdue: 23,
      rental_rate: 95,
      estimated_cost: 2185,
      last_known_location: 'Unknown - Last GPS signal lost',
      status: 'missing',
      risk_level: 'critical',
      notes: 'GPS tracking disabled. Operator phone disconnected. Site manager unaware of equipment location.'
    },
    {
      id: 'GA003',
      equipment_id: 'EQ012',
      equipment_type: 'Loader',
      model: '966K',
      manufacturer: 'Caterpillar',
      site_name: 'Santa Monica Pier',
      operator_name: 'Sarah Wilson',
      operator_phone: '+1-555-0789',
      operator_email: 'sarah.wilson@pierproject.com',
      check_out_date: '2024-01-08',
      planned_return_date: '2024-01-10',
      days_overdue: 25,
      rental_rate: 75,
      estimated_cost: 1875,
      last_known_location: 'Santa Monica Pier Construction Zone',
      status: 'investigation',
      risk_level: 'medium',
      notes: 'Equipment visible on site but operator claims it was returned. Documentation unclear.'
    },
    {
      id: 'GA004',
      equipment_id: 'EQ018',
      equipment_type: 'Crane',
      model: 'RT550E',
      manufacturer: 'Caterpillar',
      site_name: 'Bellevue Tech Campus',
      operator_name: 'David Chen',
      operator_phone: '+1-555-0321',
      operator_email: 'david.chen@techcampus.com',
      check_out_date: '2024-01-05',
      planned_return_date: '2024-01-08',
      days_overdue: 27,
      rental_rate: 95,
      estimated_cost: 2565,
      last_known_location: 'Bellevue Tech Campus - Building A',
      status: 'uncertain',
      risk_level: 'low',
      notes: 'Equipment appears to be on site but not in designated storage area. Operator on vacation.'
    },
    {
      id: 'GA005',
      equipment_id: 'EQ020',
      equipment_type: 'Bulldozer',
      model: 'D7T',
      manufacturer: 'Caterpillar',
      site_name: 'Redmond Microsoft Campus',
      operator_name: 'Lisa Rodriguez',
      operator_phone: '+1-555-0654',
      operator_email: 'lisa.rodriguez@microsoft.com',
      check_out_date: '2024-01-03',
      planned_return_date: '2024-01-06',
      days_overdue: 29,
      rental_rate: 85,
      estimated_cost: 2465,
      last_known_location: 'Microsoft Campus - Construction Zone',
      status: 'overdue',
      risk_level: 'medium',
      notes: 'Equipment in use but return date extended without proper authorization.'
    }
  ];

  useEffect(() => {
    setGhostAssets(mockGhostAssets);
  }, []);

  useEffect(() => {
    // Filter assets based on search term and filters
    let filtered = ghostAssets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(asset => 
        asset.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.equipment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.operator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.site_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(asset => asset.risk_level === riskFilter);
    }

    setFilteredAssets(filtered);
  }, [ghostAssets, searchTerm, statusFilter, riskFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'overdue': 'bg-red-100 text-red-800',
      'missing': 'bg-red-100 text-red-800',
      'uncertain': 'bg-yellow-100 text-yellow-800',
      'investigation': 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return variants[risk as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getDaysOverdueBadge = (days: number) => {
    if (days <= 7) return 'bg-green-100 text-green-800';
    if (days <= 14) return 'bg-yellow-100 text-yellow-800';
    if (days <= 21) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const totalEstimatedCost = filteredAssets.reduce((sum, asset) => sum + asset.estimated_cost, 0);
  const criticalAssets = filteredAssets.filter(asset => asset.risk_level === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ghost Assets</h2>
          <p className="text-muted-foreground">
            Track equipment that has been handed over but whose return status is uncertain
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <Clock className="h-8 w-8 text-red-600" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ghost Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              {ghostAssets.length} total in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAssets}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEstimatedCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Based on overdue days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Days Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAssets.length > 0 
                ? Math.round(filteredAssets.reduce((sum, asset) => sum + asset.days_overdue, 0) / filteredAssets.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Days since planned return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Ghost Assets</CardTitle>
          <CardDescription>
            Search and filter assets by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search equipment, operator, site..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="overdue">Overdue</option>
                <option value="missing">Missing</option>
                <option value="uncertain">Uncertain</option>
                <option value="investigation">Under Investigation</option>
              </select>
            </div>
            <div>
              <Label htmlFor="risk">Risk Level</Label>
              <select
                id="risk"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRiskFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ghost Assets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Ghost Assets ({filteredAssets.length})</h3>
          <Badge variant="outline" className="text-sm">
            Total Value: ${totalEstimatedCost.toLocaleString()}
          </Badge>
        </div>

        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-lg">{asset.equipment_type} {asset.model}</CardTitle>
                    <CardDescription>
                      {asset.manufacturer} • {asset.equipment_id}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusBadge(asset.status)}>
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  </Badge>
                  <Badge className={getRiskBadge(asset.risk_level)}>
                    {asset.risk_level.charAt(0).toUpperCase() + asset.risk_level.slice(1)} Risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Site:</span>
                    <span>{asset.site_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Operator:</span>
                    <span>{asset.operator_name}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Check-out:</span>
                    <span>{new Date(asset.check_out_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Planned Return:</span>
                    <span>{new Date(asset.planned_return_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Days Overdue:</span>
                    <Badge className={getDaysOverdueBadge(asset.days_overdue)}>
                      {asset.days_overdue} days
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Rate:</span>
                    <span>${asset.rental_rate}/hr</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Est. Cost:</span>
                    <span className="font-semibold">${asset.estimated_cost}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Last Known:</span>
                    <span className="text-xs">{asset.last_known_location}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{asset.operator_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{asset.operator_email}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Operator
                    </Button>
                  </div>
                </div>
                
                {asset.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm font-medium text-gray-700 mb-1">Notes:</div>
                    <div className="text-sm text-gray-600">{asset.notes}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAssets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No ghost assets found</p>
                <p className="text-sm">Try adjusting your search criteria or filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
