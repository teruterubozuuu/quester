import React, { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

type StatusProps ={
    status: "backlog" | "completed" | "playing";
    onStatusChange: (status:"backlog" | "completed" | "playing") => void;
}

export default function SelectStatus({status, onStatusChange}: StatusProps) {
    
  return (
    <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
            <SelectValue placeholder="Status"/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="playing">Playing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}
