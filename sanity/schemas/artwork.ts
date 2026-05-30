import {defineField, defineType} from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "艺术作品",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "作品标题",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "作品图片",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "theme",
      title: "所属策展主题",
      type: "string",
      options: {
        list: [
          {title: "粉墨 (The Stage)", value: "粉墨 (The Stage)"},
          {title: "浮生 (The World)", value: "浮生 (The World)"},
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "medium",
      title: "创作媒介",
      type: "string",
      options: {
        list: [
          {title: "摄影 (Photography)", value: "摄影 (Photography)"},
          {title: "绘画 (Painting)", value: "绘画 (Painting)"},
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exif",
      title: "摄影参数",
      type: "object",
      hidden: ({document}) => document?.medium !== "摄影 (Photography)",
      fields: [
        defineField({
          name: "focalLength",
          title: "焦段",
          type: "string",
        }),
        defineField({
          name: "aperture",
          title: "光圈",
          type: "string",
        }),
        defineField({
          name: "shutterSpeed",
          title: "快门",
          type: "string",
        }),
        defineField({
          name: "cameraModel",
          title: "相机型号",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "materials",
      title: "绘画材料",
      type: "string",
      description: "如布面油画、水墨等",
      hidden: ({document}) => document?.medium !== "绘画 (Painting)",
    }),
    defineField({
      name: "story",
      title: "作品故事",
      type: "text",
      rows: 6,
      description: "作品背后的故事、意境描述或相关演出背景",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      theme: "theme",
      medium: "medium",
    },
    prepare({title, media, theme, medium}) {
      return {
        title,
        media,
        subtitle: [theme, medium].filter(Boolean).join(" · "),
      };
    },
  },
});
