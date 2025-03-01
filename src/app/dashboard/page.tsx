"use client";
import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      console.log(data);
      setProperties(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      // Change err to error and add type
      setError("Failed to load properties");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to remove this property?')) {
      try {
        const response = await fetch('/api/properties/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),  // Send slug in the request body
        });
        if (response.ok) {
          setProperties(prev => prev.filter(p => p.fieldData.slug !== slug));
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete property');
        }
      } catch (error: unknown) {
        setError('Failed to delete property');
        console.error('Error:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
     const response = await fetch("/api/auth/account", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const handleRedirect = async () => {
    window.location.href = "https://figma-to-webflow-92b852.webflow.io/";
  };

  // Add this button to your dashboard JSX

  const handleRedirectToChangePassword = async () => {
    router.push("/change_password");
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">My Saved Properties</h1>
        <div className="flex justify-around">
      <button
          onClick={handleRedirect}
          className="text-white hover:text-green-800 bg-green-500 px-4 py-2 rounded-md"
        >
        Home
        </button>
        <button
          onClick={handleLogout}
          className="text-white hover:bg-orange-800 bg-orange-500 ml-40 px-4 py-2 rounded-md"
          >
          Logout
        </button>
        <button
          onClick={handleRedirectToChangePassword}
          className="text-white hover:bg-blue-800 bg-blue-500 ml-40 px-4 py-2 rounded-md"
        >
          change password
        </button>
        <button
          onClick={handleDeleteAccount}
          className="text-white hover:bg-red-800 bg-red-500 ml-40 px-4 py-2 rounded-md"
        >
          Delete Account
        </button>
      </div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onDelete={handleDelete}
          />
        ))}
      </div>

    </div>
  );
}
