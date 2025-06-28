import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useRoute } from "wouter";

const editArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  date: z.string().min(1, "Date is required"),
});

type EditArticleForm = z.infer<typeof editArticleSchema>;

export default function EditArticle() {
  const [, params] = useRoute("/admin/edit-article/:id");
  const articleId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: article, isLoading } = useQuery({
    queryKey: ["/api/policy-briefs", articleId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/policy-briefs/${articleId}`);
      return await res.json();
    },
    enabled: !!articleId,
  });

  const form = useForm<EditArticleForm>({
    resolver: zodResolver(editArticleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      author: "",
      date: "",
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        author: article.author || "",
        date: article.date || "",
      });
    }
  }, [article, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: EditArticleForm) => {
      const res = await apiRequest("PATCH", `/api/policy-briefs/${articleId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/policy-briefs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditArticleForm) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/research">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Research
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Article</h1>
          <p className="text-gray-600">Make changes to the article content and settings</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Article title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Author name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Publication date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief summary of the article"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Article content in Markdown format"
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}