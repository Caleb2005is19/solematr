'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Loader2, RefreshCw, CheckCircle, AlertTriangle, SwitchCamera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Shoe } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onImageUploaded: (image: Shoe['images'][0]) => void;
}

export function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const { toast } = useToast();
  const storage = useStorage();

  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera Capture State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const getCameraPermission = useCallback(async () => {
    // Reset state before requesting to show loading indicator
    setHasCameraPermission(null);
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  }, [facingMode, toast]);

  useEffect(() => {
    if (activeTab === 'camera') {
      getCameraPermission();
    }
    // Cleanup function to stop camera when component unmounts or tab changes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab, getCameraPermission]);
  
  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    let imageBlob: Blob | null = null;
    let imageName: string = 'product-image.jpg';

    if (activeTab === 'upload' && selectedFile) {
        imageBlob = selectedFile;
        imageName = selectedFile.name;
    } else if (activeTab === 'camera' && capturedImage) {
        const response = await fetch(capturedImage);
        imageBlob = await response.blob();
        imageName = `capture-${Date.now()}.jpg`
    }

    if (!imageBlob || !storage) {
      toast({ variant: 'destructive', title: 'No image selected or storage unavailable' });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    const imageId = uuidv4();
    const filePath = `product-images/${imageId}-${imageName}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (error) => {
        console.error('Upload failed:', error);
        let description = 'There was a problem uploading your image.';
        // Check for specific Firebase Storage error codes
        switch (error.code) {
          case 'storage/unauthorized':
            description = 'Permission Denied. Ensure your Storage security rules allow writes for admins.';
            break;
          case 'storage/canceled':
            description = 'The upload was canceled.';
            break;
          case 'storage/unknown':
            description = 'An unknown error occurred. Please check your network connection and storage rules.';
            break;
          default:
            description = error.message;
            break;
        }
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: description,
        });
        setIsUploading(false);
        setProgress(0);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onImageUploaded({
          id: imageId,
          url: downloadURL,
          alt: 'A product image',
          hint: 'shoe photo',
          path: filePath,
        });
        toast({
          title: 'Upload Successful',
          description: 'Your image has been added.',
          action: <CheckCircle className="text-green-500" />,
        });
        
        // Reset state after successful upload
        setIsUploading(false);
        setProgress(0);
        setSelectedFile(null);
        setCapturedImage(null);
      }
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" />Upload File</TabsTrigger>
          <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4" />Use Camera</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="p-4 border rounded-md text-center space-y-4">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Choose a file
            </Button>
            {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
          </div>
        </TabsContent>
        
        <TabsContent value="camera">
          <div className="p-4 border rounded-md space-y-4">
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use this feature.
                  </AlertDescription>
                  <Button variant="secondary" className="mt-3" onClick={getCameraPermission}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </Alert>
            )}
            <div className="relative aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
                {capturedImage ? (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                ) : (
                    <>
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                         {hasCameraPermission === null && <Loader2 className="h-8 w-8 animate-spin absolute" />}
                    </>
                )}
            </div>
             <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex justify-center gap-4">
                {capturedImage ? (
                    <Button type="button" variant="outline" onClick={() => setCapturedImage(null)} disabled={isUploading}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Retake
                    </Button>
                ) : (
                    <>
                        <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || isUploading}>
                            <Camera className="mr-2 h-4 w-4" /> Capture
                        </Button>
                        <Button type="button" variant="outline" size="icon" onClick={toggleFacingMode} disabled={!hasCameraPermission || isUploading}>
                            <SwitchCamera className="h-4 w-4"/>
                        </Button>
                    </>
                )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isUploading && (
        <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">Uploading... {Math.round(progress)}%</p>
        </div>
      )}

      <Button 
        type="button" 
        className="w-full" 
        onClick={handleUpload} 
        disabled={isUploading || (activeTab === 'upload' && !selectedFile) || (activeTab === 'camera' && !capturedImage)}
      >
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
}
